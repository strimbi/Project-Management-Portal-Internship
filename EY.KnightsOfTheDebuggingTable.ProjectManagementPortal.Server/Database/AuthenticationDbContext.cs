using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Database
{
    public class AuthenticationDbContext(DbContextOptions<AuthenticationDbContext> options) : IdentityDbContext<User>(options)
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.HasDefaultSchema("identity");
        }
    }
}
