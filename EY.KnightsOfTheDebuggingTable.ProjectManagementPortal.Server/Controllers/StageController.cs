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
    [Route("api/stages")]
    public class StageController(StageService stageService) : ControllerBase
    {
        private readonly StageService _stageService = stageService;

        // GET: api/stages
        [HttpGet]
        public async Task<ActionResult<List<StageDto>>> GetAllStages()
        {
            var stages = await _stageService.GetAllStages();

            return Ok(stages);
        }

        // GET: api/stages/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<StageDto>> GetStageById(Guid id)
        {
            var stage = await _stageService.GetStageById(id);

            if (stage == null)
            {
                return NotFound();
            }

            return Ok(stage);
        }
    }
}
