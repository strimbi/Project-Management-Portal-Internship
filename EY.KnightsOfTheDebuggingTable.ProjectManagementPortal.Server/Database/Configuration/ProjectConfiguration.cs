using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Util;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Database.Configuration
{
    public class ProjectConfiguration : IEntityTypeConfiguration<Project>
    {
        public void Configure(EntityTypeBuilder<Project> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.Id)
                .ValueGeneratedNever();

            builder.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(Constants.DefaultTextFieldLength);

            builder.HasIndex(p => p.Name)
                .IsUnique();

            builder.Property(p => p.Description)
                .HasMaxLength(Constants.DescriptionMaxLength);

            builder.Property(p => p.StartDate)
                .IsRequired()
                .HasColumnType("date");

            builder.Property(p => p.EndDate)
                .HasColumnType("date");

            builder.Property(p => p.CreatedBy)
                .IsRequired();

            builder.Property(p => p.OwnerId)
                .IsRequired();

            builder.HasOne(p => p.Template)
                .WithMany(t => t.Projects)
                .HasForeignKey(p => p.TemplateId)
                .OnDelete(DeleteBehavior.NoAction)
                .IsRequired();

            builder.HasOne(p => p.CurrentStage)
                .WithMany()
                .HasForeignKey(p => p.CurrentStageId)
                .OnDelete(DeleteBehavior.NoAction)
                .IsRequired();

            builder.HasMany(x => x.Stakeholders)
                .WithOne(r => r.Project)
                .HasForeignKey(r => r.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(x => x.Tasks)
                .WithOne(r => r.Project)
                .HasForeignKey(r => r.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(x => x.Resources)
                .WithOne(r => r.Project)
                .HasForeignKey(r => r.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.ToTable("Projects", t =>
            {
                t.HasCheckConstraint("CK_Project_EndDate", "EndDate > StartDate");
            });
        }
    }
}
