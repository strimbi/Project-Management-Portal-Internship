using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.DTOs;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/projects")]
    public class StakeholderController(StakeholderService stakeholderService) : ControllerBase
    {
        private readonly StakeholderService _stakeholderService = stakeholderService;

        // GET: api/projects/{projectId}/stakeholders
        [HttpGet("{projectId}/stakeholders")]
        public async Task<ActionResult<IEnumerable<StakeholderDto>>> GetStakeholders(Guid projectId)
        {
            return await _stakeholderService.GetAllStakeholders(projectId);
        }

        // GET: api/projects/{projectId}/stakeholders/{stakeholderId}
        [HttpGet("{projectId}/stakeholders/{stakeholderId}")]
        public async Task<ActionResult<StakeholderDto>> GetStakeholderById(Guid projectId, Guid stakeholderId)
        {
            var stakeholder = await _stakeholderService.GetStakeholderById(projectId, stakeholderId);

            if (stakeholder == null)
            {
                return NotFound();
            }

            return stakeholder;
        }

        // POST: api/projects/{projectId}/stakeholders
        [HttpPost("{projectId}/stakeholders")]
        public async Task<ActionResult<StakeholderDto>> PostStakeholder(StakeholderDto stakeholderDto)
        {
            try
            {
                await _stakeholderService.AddStakeholder(stakeholderDto);

                return CreatedAtAction(nameof(GetStakeholderById), new { projectId = stakeholderDto.ProjectId, stakeholderId = stakeholderDto.Id }, stakeholderDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/projects/{projectId}/stakeholders/{stakeholderId}
        [HttpPut("{projectId}/stakeholders/{stakeholderId}")]
        public async Task<IActionResult> PutStakeholder(Guid projectId, StakeholderDto stakeholderDto)
        {
            await _stakeholderService.UpdateStakeholder(projectId, stakeholderDto);

            return NoContent();
        }

        // DELETE: api/projects/{projectId}/stakeholders/{stakeholderId}
        [HttpDelete("{projectId}/stakeholders/{stakeholderId}")]
        public async Task<IActionResult> DeleteStakeholder(Guid projectId, Guid stakeholderId)
        {
            await _stakeholderService.DeleteStakeholder(projectId, stakeholderId);

            return NoContent();
        }

    }
}
