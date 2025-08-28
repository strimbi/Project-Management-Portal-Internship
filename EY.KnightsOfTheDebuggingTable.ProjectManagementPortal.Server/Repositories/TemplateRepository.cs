using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Database;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Repositories
{
    public class TemplateRepository(AppDbContext context)
    {
        private readonly AppDbContext _context = context;

        public Task<List<Template>> GetAllTemplates()
        {
            return _context.Templates.Include(t => t.Stages).ToListAsync();
        }

        public Task<List<Template>> GetAllTemplatesByUserId(Guid userId)
        {
            return _context.Templates.Include(t => t.Stages).Where(p => p.CreatedBy == userId).ToListAsync();
        }

        public Task<Template> GetTemplateById(Guid id)
        {
            return _context.Templates.Include(t => t.Stages).FirstOrDefaultAsync(p => p.Id == id);
        }

        public Task<Template> GetTemplateByName(string name)
        {
            return _context.Templates.Include(t => t.Stages).FirstOrDefaultAsync(p => p.Name == name);
        }
    }
}
