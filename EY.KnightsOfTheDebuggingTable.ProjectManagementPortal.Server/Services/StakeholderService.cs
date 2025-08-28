using AutoMapper;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Database;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.DTOs;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Task = System.Threading.Tasks.Task;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Services
{
    public class StakeholderService(AppDbContext context, UserService userService, ProjectRepository projectRepository, IMapper mapper)
    {
        private readonly AppDbContext _context = context;
        private readonly UserService _userService = userService;
        private readonly ProjectRepository _projectRepository = projectRepository;
        private readonly IMapper _mapper = mapper;

        public async Task<List<StakeholderDto>> GetAllStakeholders(Guid projectId)
        {
            var project = await _projectRepository.GetProjectById(projectId);
            var stakeholders = project.Stakeholders.ToList();

            return _mapper.Map<List<StakeholderDto>>(stakeholders);
        }

        public async ValueTask<StakeholderDto> GetStakeholderById(Guid projectId, Guid stakeholderId)
        {
            var project = await _projectRepository.GetProjectById(projectId);
            var stakeholder = project.Stakeholders.FirstOrDefault(s => s.Id == stakeholderId);

            return _mapper.Map<StakeholderDto>(stakeholder);
        }

        public async Task AddStakeholder(StakeholderDto stakeholderDto)
        {
            var project = await _projectRepository.GetProjectById(stakeholderDto.ProjectId);
            var user = await _userService.GetUserById(stakeholderDto.UserId);

            if (project == null)
            {
                throw new Exception("Project not found.");
            }

            var stakeholder = new Stakeholder
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                ProjectId = project.Id,
                Role = stakeholderDto.Role,
            };

            project.Stakeholders.Add(stakeholder);

            stakeholderDto.Id = stakeholder.Id;
            stakeholderDto.UserId = stakeholder.UserId;
            stakeholderDto.ProjectId = stakeholder.ProjectId;

            await _context.SaveChangesAsync();
        }

        public async Task UpdateStakeholder(Guid projectId, StakeholderDto stakeholderDto)
        {
            var project = await _projectRepository.GetProjectById(projectId);
            var existingStakeholder = project.Stakeholders.FirstOrDefault(s => s.Id == stakeholderDto.Id);

            if (existingStakeholder == null)
            {
                throw new Exception("Stakeholder not found.");
            }

            existingStakeholder.Role = stakeholderDto.Role;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteStakeholder(Guid projectId, Guid stakeholderId)
        {
            var project = await _projectRepository.GetProjectById(projectId);
            var stakeholderToDelete = _context.Stakeholders.Include(s => s.Approvals).FirstOrDefault(s => s.Id == stakeholderId) ?? throw new Exception("Stakeholder not found.");

            var approvalsToDelete = stakeholderToDelete.Approvals;
            _context.Approvals.RemoveRange(approvalsToDelete);
            project.Stakeholders.Remove(stakeholderToDelete);
            await _context.SaveChangesAsync();
        }
    }
}
