using AutoMapper;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Database;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.DTOs;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Repositories;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Util;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Services
{
    public class TemplateService(TemplateRepository repository, AppDbContext context, IMapper mapper)
    {
        private readonly TemplateRepository _repository = repository;
        private readonly AppDbContext _context = context;
        private readonly IMapper _mapper = mapper;

        public async Task<List<TemplateDto>> GetAllTemplates()
        {
            // _context.Database.ExecuteSqlRaw("delete from AdvanceRequests");
            var templates = await _repository.GetAllTemplates();

            return _mapper.Map<List<TemplateDto>>(templates);
        }

        public async Task<List<TemplateDto>> GetAllTemplatesByUserId(Guid userId)
        {
            var templates = await _repository.GetAllTemplatesByUserId(userId);

            return _mapper.Map<List<TemplateDto>>(templates);
        }

        public async Task<TemplateDto> GetTemplateById(Guid id)
        {
            var template = await _repository.GetTemplateById(id);

            var templateDto = _mapper.Map<TemplateDto>(template);

            templateDto.Stages = _mapper.Map<List<StageDto>>(template.Stages);

            return templateDto;
        }

        public async Task<TemplateDto> GetTemplateByName(string name)
        {
            var template = await _repository.GetTemplateByName(name);

            return _mapper.Map<TemplateDto>(template);
        }

        public async System.Threading.Tasks.Task AddTemplate(TemplateDto templateDto)
        {
            templateDto.Id = Guid.NewGuid();

            var validationErrors = await Validate(templateDto);

            if (validationErrors.Count != 0)
            {
                throw new ArgumentException(string.Join(", ", validationErrors));
            }

            var existingStages = await _context.Stages
                .Where(s => templateDto.Stages.Select(stage => stage.Id).Contains(s.Id))
                .ToListAsync();

            var template = _mapper.Map<Template>(templateDto);

            template.Stages = existingStages;

            _context.Templates.Add(template);

            await _context.SaveChangesAsync();
        }

        private async Task<List<string>> Validate(TemplateDto templateDto)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(templateDto.Name))
            {
                errors.Add("Name is required.");
            }

            if (templateDto.Name.Length > Constants.DefaultTextFieldLength)
            {
                errors.Add($"Name is longer than {Constants.DefaultTextFieldLength} characters.");
            }

            if (templateDto.Description.Length > Constants.DescriptionMaxLength)
            {
                errors.Add($"Description is longer than {Constants.DescriptionMaxLength} characters.");
            }

            if (templateDto.Stages.Count == 0)
            {
                errors.Add("At least one stage is required.");
            }
            else
            {
                var providedStageIds = templateDto.Stages.Select(s => s.Id).ToList();

                var existingStageIds = await _context.Stages
                    .Where(s => providedStageIds.Contains(s.Id))
                    .Select(s => s.Id)
                    .ToListAsync();

                var invalidStageIds = providedStageIds.Except(existingStageIds).ToList();

                if (invalidStageIds.Count != 0)
                {
                    errors.Add($"The following stage IDs are invalid: {string.Join(", ", invalidStageIds)}.");
                }
                ///is this validation necessery?
            }

            var existingTemplate = await _repository.GetTemplateByName(templateDto.Name);

            if (existingTemplate != null && templateDto.Id != null && existingTemplate.Id != templateDto.Id)
            {
                errors.Add("Name already exists.");
            }

            return errors;
        }
    }
}
