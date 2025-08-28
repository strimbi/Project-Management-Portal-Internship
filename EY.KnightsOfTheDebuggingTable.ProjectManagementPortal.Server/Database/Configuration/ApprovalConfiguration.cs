using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Database.Configuration
{
    public class ApprovalConfiguration : IEntityTypeConfiguration<Approval>
    {
        public void Configure(EntityTypeBuilder<Approval> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Property(a => a.Id)
                .ValueGeneratedNever();

            builder.Property(a => a.Status)
                .IsRequired();

            builder.Property(a => a.ApprovedAt)
                .HasColumnType("datetime");

            builder.HasOne(a => a.Stakeholder)
                .WithMany(a => a.Approvals)
                .HasForeignKey(a => a.StakeholderId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(a => a.AdvanceRequest)
                .WithMany(a => a.Approvals)
                .HasForeignKey(a => a.AdvanceRequestId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        }
    }
}
