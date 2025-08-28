using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Database;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Repositories
{
    public class ApprovalRepository(AppDbContext context)
    {
        private readonly AppDbContext _context = context;

        public Task<List<Approval>> GetAllApprovalsByRequestId(Guid requestId)
        {
            return _context.Approvals.Where(a => a.AdvanceRequestId == requestId).ToListAsync();
        }

        public Task<List<Approval>> GetAllApprovalsByStakeholderIds(List<Guid> stakeholderIds)
        {
            return _context.Approvals
                    .Include(a => a.AdvanceRequest)
                        .ThenInclude(ar => ar.Project)
                    .Include(a => a.AdvanceRequest.CurrentStage)
                    .Include(a => a.AdvanceRequest.NextStage)
                    .Where(a => stakeholderIds.Contains(a.StakeholderId))
                    .ToListAsync();
        }

        public Task<Approval> GetApprovalById(Guid id)
        {
            return _context.Approvals.FirstOrDefaultAsync(a => a.Id == id);
        }
    }
}
