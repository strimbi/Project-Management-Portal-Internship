using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Database.Configuration
{
    public class AdvanceRequestConfiguration : IEntityTypeConfiguration<AdvanceRequest>
    {
        public void Configure(EntityTypeBuilder<AdvanceRequest> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Property(a => a.Id)
                .ValueGeneratedNever();

            builder.Property(a => a.RequestedAt)
                .HasColumnType("datetime")
                .IsRequired();

            builder.Property(a => a.Status)
                .HasConversion<byte>()
                .IsRequired();

            builder.HasOne(a => a.Project)
                .WithMany(p => p.AdvanceRequests)
                .HasForeignKey(a => a.ProjectId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            builder.HasOne(a => a.CurrentStage)
                .WithMany()
                .HasForeignKey(a => a.CurrentStageId)
                .OnDelete(DeleteBehavior.NoAction)
                .IsRequired();

            builder.HasOne(a => a.NextStage)
                .WithMany()
                .HasForeignKey(a => a.NextStageId)
                .OnDelete(DeleteBehavior.NoAction)
                .IsRequired();

        }
    }
}
