using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Util;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Database.Configuration
{
    public class StakeholderConfiguration : IEntityTypeConfiguration<Stakeholder>
    {
        public void Configure(EntityTypeBuilder<Stakeholder> builder)
        {
            builder.HasKey(s => s.Id);

            builder.Property(s => s.Id)
                .ValueGeneratedNever();

            builder.Property(s => s.UserId)
                .IsRequired();            

            builder.Property(s => s.ProjectId)
                .IsRequired();

            builder.Property(s => s.UserId)
                .IsRequired();

            builder.Property(s => s.Role)
                .IsRequired()
                .HasMaxLength(Constants.DefaultTextFieldLength);
        }
    }
}
