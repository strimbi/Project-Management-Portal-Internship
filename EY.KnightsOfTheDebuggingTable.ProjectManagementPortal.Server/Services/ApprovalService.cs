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

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Services
{
    public class ApprovalService(ApprovalRepository approvalRepository, AppDbContext context, IMapper mapper)
    {
        private readonly ApprovalRepository _approvalRepository = approvalRepository;
        private readonly AppDbContext _context = context;
        private readonly IMapper _mapper = mapper;

        public async Task<List<ApprovalDto>> GetApprovalsByUserId(Guid userId)
        {
            var stakeholders = await _context.Stakeholders.Where(s => s.UserId == userId).ToListAsync();

            if (stakeholders.Count == 0)
            {
                return [];
            }

            var staleholdersIds = stakeholders.Select(s => s.Id).ToList();
            var approvals = await _approvalRepository.GetAllApprovalsByStakeholderIds(staleholdersIds);

            return _mapper.Map<List<ApprovalDto>>(approvals);
        }

        public async Task<ApprovalDto> GetApprovalById(Guid approvalId)
        {
            var approval = await _approvalRepository.GetApprovalById(approvalId);

            return _mapper.Map<ApprovalDto>(approval);
        }

        public async System.Threading.Tasks.Task RecordApproval(Guid approvalId, ApprovalStatus status)
        {
            var approval = await _approvalRepository.GetApprovalById(approvalId) ?? throw new ArgumentException("Invalid approval.");

            if (approval.Status != ApprovalStatus.Pending)
            {
                throw new ArgumentException("Status of approval needs to be pending to be aproved or rejected.");
            }

            if (status == ApprovalStatus.Pending)
            {
                throw new ArgumentException("Status needs to be Approved or Rejected.");
            }

            approval.ApprovedAt = DateTime.Now;
            approval.Status = status;

            await _context.SaveChangesAsync();
        }
    }
}
