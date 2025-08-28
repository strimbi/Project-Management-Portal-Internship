using AutoMapper;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Database;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.DTOs;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Services
{
    public class AdvanceRequestService(
        AdvanceRequestRepository advanceRequestRepository,
        ApprovalRepository approvalRepository,
        ProjectRepository projectRepository,
        TemplateRepository templateRepository,
        AppDbContext context,
        IMapper mapper)
    {
        private readonly AppDbContext _context = context;
        private readonly AdvanceRequestRepository _advanceRequestRepository = advanceRequestRepository;
        private readonly ApprovalRepository _approvalRepository = approvalRepository;
        private readonly ProjectRepository _projectRepository = projectRepository;
        private readonly TemplateRepository _templateRepository = templateRepository;
        private readonly IMapper _mapper = mapper;

        public async Task<List<AdvanceRequestDto>> GetAdvanceRequestsByUserId(Guid userId)
        {
            var advanceRequests = await _advanceRequestRepository.GetAdvanceRequestsByUserId(userId);

            return _mapper.Map<List<AdvanceRequestDto>>(advanceRequests);
        }

        public async Task<AdvanceRequestDto> GetAdvanceRequestById(Guid id)
        {
            var advanceRequests = await _advanceRequestRepository.GetAdvanceRequestById(id);

            return _mapper.Map<AdvanceRequestDto>(advanceRequests);
        }

        public async Task<AdvanceRequestDto> GetAdvanceRequestByProjectId(Guid projectId)
        {
            var advanceRequests = await _advanceRequestRepository.GetAdvanceRequestsByProjectId(projectId);

            return _mapper.Map<AdvanceRequestDto>(advanceRequests);
        }

        public async System.Threading.Tasks.Task AddAdvanceRequest(AdvanceRequestDto advanceRequestDto)
        {
            var existingRequest = await _advanceRequestRepository.GetAdvanceRequestsByProjectId(advanceRequestDto.ProjectId);

            if (existingRequest != null && existingRequest.Any(e => e.Status == ApprovalStatus.Pending))
            {
                throw new ArgumentException("Advance request already exists for this project");
            }

            var project = await _projectRepository.GetProjectById(advanceRequestDto.ProjectId) ?? throw new ArgumentException("Project not found.");
            var template = await _templateRepository.GetTemplateById(project.TemplateId) ?? throw new ArgumentException("Template not found.");

            advanceRequestDto.Id = Guid.NewGuid();
            advanceRequestDto.RequestedAt = DateTime.Now;
            advanceRequestDto.Status = ApprovalStatus.Pending;

            advanceRequestDto.CurrentStageId = project.CurrentStage.Id;
            var nextStage = template.Stages
                .Where(s => s.Order > project.CurrentStage.Order)
                .OrderBy(s => s.Order)
                .FirstOrDefault();

            if (nextStage == null)
            {
                throw new ArgumentException("Current stage is the final stage, no advance possible.");
            }

            advanceRequestDto.NextStageId = nextStage.Id;
            var advanceRequest = _mapper.Map<AdvanceRequest>(advanceRequestDto);

            project.AdvanceRequests.Add(advanceRequest);

            var approvals = project.Stakeholders.Select(s => new Approval
            {
                Id = Guid.NewGuid(),
                StakeholderId = s.Id,
                AdvanceRequestId = advanceRequest.Id,
                Status = ApprovalStatus.Pending,
                ApprovedAt = null,
            }).ToList();

            await _context.Approvals.AddRangeAsync(approvals);

            await _context.SaveChangesAsync();
        }

        public async Task<bool> CheckAdvanceRequestAvailableByProjectId(Guid projectId)
        {
            var advanceRequests = await _advanceRequestRepository.GetAdvanceRequestsByProjectId(projectId) ?? throw new ArgumentException("Advance Request not found.");
            var project = await _projectRepository.GetProjectById(projectId) ?? throw new ArgumentException("Project not found.");
            var template = await _templateRepository.GetTemplateById(project.TemplateId) ?? throw new ArgumentException("Template not found.");

            var nextStage = template.Stages
                .Where(s => s.Order > project.CurrentStage.Order)
                .OrderBy(s => s.Order)
                .FirstOrDefault();

            return (nextStage == null || advanceRequests.Any(e => e.Status == ApprovalStatus.Pending));
        }

        public async Task<bool> ProcessAdvanceRequest(Guid advanceRequestId)
        {
            var approvals = await _approvalRepository.GetAllApprovalsByRequestId(advanceRequestId);

            if (approvals == null || approvals.Count == 0)
            {
                throw new InvalidOperationException("No approvals found for this advance request.");
            }

            int totalStakeholders = approvals.Count;
            int approvalsCount = approvals.Count(a => a.Status == ApprovalStatus.Approved);
            int requiredMajority = (totalStakeholders / 2) + 1;

            var advanceRequest = await _advanceRequestRepository.GetAdvanceRequestById(advanceRequestId);
            var project = await _projectRepository.GetProjectById(advanceRequest.ProjectId);

            if (approvalsCount >= requiredMajority)
            {
                project.CurrentStageId = advanceRequest.NextStageId;
                advanceRequest.Status = ApprovalStatus.Approved;
                await _context.SaveChangesAsync();

                return true;
            }

            advanceRequest.Status = ApprovalStatus.Rejected;
            await _context.SaveChangesAsync();

            return false;
        }

        public async Task<bool> CheckAllResponsesReceived(Guid advanceRequestId)
        {
            var approvals = await _approvalRepository.GetAllApprovalsByRequestId(advanceRequestId);
            var anyPending = approvals.Any(a => a.Status == ApprovalStatus.Pending);

            return !anyPending;
        }
    }
}
