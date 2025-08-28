using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Database;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Repositories
{
    public class AdvanceRequestRepository(AppDbContext context)
    {
        private readonly AppDbContext _context = context;

        public Task<List<AdvanceRequest>> GetAdvanceRequests()
        {
            return _context.AdvanceRequests.ToListAsync();
        }

        public Task<List<AdvanceRequest>> GetAdvanceRequestsByUserId(Guid userId)
        {
            return _context.AdvanceRequests.Include(a => a.Project).Where(a => a.RequestedById == userId).ToListAsync();
        }

        public Task<List<AdvanceRequest>> GetAdvanceRequestsByProjectId(Guid projectId)
        {
            return _context.AdvanceRequests.Where(a => a.ProjectId == projectId).ToListAsync();
        }

        public Task<AdvanceRequest> GetAdvanceRequestById(Guid id)
        {
            return _context.AdvanceRequests
                .Include(a => a.Project)
                .FirstOrDefaultAsync(a => a.Id == id);
        }
    }
}
