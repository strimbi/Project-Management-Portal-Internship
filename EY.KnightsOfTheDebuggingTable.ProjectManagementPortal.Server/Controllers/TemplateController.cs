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
    [Route("api/templates")]
    public class TemplateController(TemplateService templateService) : ControllerBase
    {
        private readonly TemplateService _templateService = templateService;

        // GET: api/templates
        [HttpGet]
        public async Task<ActionResult<List<TemplateDto>>> GetAllTemplates()
        {
            var templates = await _templateService.GetAllTemplates();

            return Ok(templates);
        }

        // GET: api/templates/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TemplateDto>> GetTemplateById(Guid id)
        {
            var template = await _templateService.GetTemplateById(id);

            if (template == null)
            {
                return NotFound();
            }            

            return Ok(template);
        }

        // POST: api/templates
        [HttpPost]
        public async Task<ActionResult<TemplateDto>> AddTemplate(TemplateDto templateDto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                templateDto.CreatedBy = Guid.Parse(userId);

                await _templateService.AddTemplate(templateDto);
                return CreatedAtAction(nameof(GetTemplateById), new { id = templateDto.Id }, templateDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
}
