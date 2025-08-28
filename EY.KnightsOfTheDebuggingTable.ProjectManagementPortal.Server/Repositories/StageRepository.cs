using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Database;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Repositories
{
    public class StageRepository(AppDbContext context)
    {
        private readonly AppDbContext _context = context;

        public Task<List<Stage>> GetStages()
        {
            return _context.Stages.ToListAsync();
        }

        public Task<Stage> GetStageById(Guid id)
        {
            return _context.Stages.FirstOrDefaultAsync(s => s.Id == id);
        }

        public Task<Stage> GetStageByName(string name)
        {
            return _context.Stages.FirstOrDefaultAsync(s => s.Name == name);
        }
    }
}
