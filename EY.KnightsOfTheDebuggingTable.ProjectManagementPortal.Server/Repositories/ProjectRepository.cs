using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Database;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Repositories
{
    public class ProjectRepository(AppDbContext context)
    {
        private readonly AppDbContext _context = context;

        public Task<List<Project>> GetAllProjects()
        {
            return _context.Projects.Include(p => p.Template).ToListAsync();
        }

        public Task<List<Project>> GetAllProjectsByUserId(Guid userId)
        {
            return _context.Projects
                .Include(p => p.Tasks)
                .Include(p => p.Resources)
                .Include(p => p.Template)
                .ThenInclude(t => t.Stages)
                .Where(p => p.CreatedBy == userId || p.OwnerId == userId
                || p.Resources.Select(r => r.UserId).Contains(userId)
                || p.Stakeholders.Select(s => s.UserId).Contains(userId))
                .ToListAsync();
        }

        public Task<Project> GetProjectById(Guid id)
        {
            return _context.Projects
                .Include(p => p.CurrentStage)
                .Include(p => p.Stakeholders)
                .Include(p => p.Template)
                .Include(p => p.Resources)
                .Include(p => p.Tasks)
                .Include(p => p.AdvanceRequests)
                .ThenInclude(ar => ar.Approvals)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public Task<Project> GetProjectByName(string name)
        {
            return _context.Projects.Include(p => p.Template).FirstOrDefaultAsync(p => p.Name == name);
        }
    }
}
