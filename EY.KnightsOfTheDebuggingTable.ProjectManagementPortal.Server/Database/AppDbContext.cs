using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System.Reflection;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Database
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<Project> Projects { get; set; }
        public DbSet<Template> Templates { get; set; }
        public DbSet<Stage> Stages { get; set; }
        public DbSet<Stakeholder> Stakeholders { get; set; }
        public DbSet<Task> Tasks { get; set; }
        public DbSet<Resource> Resources { get; set; }
        public DbSet<AdvanceRequest> AdvanceRequests { get; set; }
        public DbSet<Approval> Approvals { get; set; }

        public AppDbContext(string connectionString) : this(new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlServer(connectionString)
            .Options)
        {
        }

        // FIXME: investigate source of warning
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.ConfigureWarnings(warnings =>
            warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}
