using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.DTOs;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/approvals")]
    public class ApprovalController(ApprovalService approvalService, AdvanceRequestService advanceRequestService) : ControllerBase
    {
        private readonly ApprovalService _approvalService = approvalService;
        private readonly AdvanceRequestService _advanceRequestService = advanceRequestService;

        // GET: api/approvals
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetApprovals()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var approvals = await _approvalService.GetApprovalsByUserId(userId);

            return Ok(approvals);
        }

        // POST: api/approvals/approve/{approvalId}
        [HttpPost("approve/{approvalId}")]
        public async Task<ActionResult> ApproveAdvanceRequest(Guid approvalId)
        {
            try
            {
                await _approvalService.RecordApproval(approvalId, ApprovalStatus.Approved);
                var approval = await _approvalService.GetApprovalById(approvalId);

                var allResponsesReceived = await _advanceRequestService.CheckAllResponsesReceived(approval.AdvanceRequestId);
                if (allResponsesReceived)
                {
                    bool majorityApproved = await _advanceRequestService.ProcessAdvanceRequest(approval.AdvanceRequestId);
                    if (majorityApproved)
                    {
                        return Ok("Advance request approved and project moved to the next stage.");
                    }
                    else
                    {
                        return Ok("Advance request not approved by the majority.");
                    }
                }

                return Ok("Waiting for more approvals.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/approvals/reject/{approvalId}
        [HttpPost("reject/{approvalId}")]
        public async Task<ActionResult> RejectAdvanceRequest(Guid approvalId)
        {
            try
            {
                await _approvalService.RecordApproval(approvalId, ApprovalStatus.Rejected);
                var approval = await _approvalService.GetApprovalById(approvalId);

                var allResponsesReceived = await _advanceRequestService.CheckAllResponsesReceived(approval.AdvanceRequestId);
                if (allResponsesReceived)
                {
                    bool majorityApproved = await _advanceRequestService.ProcessAdvanceRequest(approval.AdvanceRequestId);
                    if (majorityApproved)
                    {
                        return Ok("Advance request approved and project moved to the next stage.");
                    }
                    else
                    {
                        return Ok("Advance request not approved by the majority.");
                    }
                }

                return Accepted("Waiting for more approvals.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
