using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.DTOs;
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
    [Route("api/advance-requests")]
    public class AdvanceRequestController(AdvanceRequestService advanceRequestService) : ControllerBase
    {
        private readonly AdvanceRequestService _advanceRequestService = advanceRequestService;

        // GET: api/advance-requests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetAdvanceRequests()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var advanceRequests = await _advanceRequestService.GetAdvanceRequestsByUserId(userId);

            return Ok(advanceRequests);
        }

        // GET: api/advance-requests/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDto>> GetAdvanceRequestById(Guid id)
        {
            var advanceRequest = await _advanceRequestService.GetAdvanceRequestById(id);

            if (advanceRequest == null)
            {
                return NotFound();
            }

            return Ok(advanceRequest);
        }

        // GET: api/advance-requests/exists/{projectId}
        [HttpGet("exists/{projectId}")]
        public async Task<ActionResult<bool>> CheckAdvanceRequestAvailable(Guid projectId)
        {
            try
            {
                var exists = await _advanceRequestService.CheckAdvanceRequestAvailableByProjectId(projectId);

                return Ok(exists);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }


        // POST: api/advance-requests
        [HttpPost]
        public async Task<ActionResult<AdvanceRequestDto>> AddAdvanceRequest(AdvanceRequestDto advanceRequestDto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                advanceRequestDto.RequestedById = Guid.Parse(userId);

                await _advanceRequestService.AddAdvanceRequest(advanceRequestDto);

                return CreatedAtAction(nameof(GetAdvanceRequestById), new { id = advanceRequestDto.Id }, advanceRequestDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
