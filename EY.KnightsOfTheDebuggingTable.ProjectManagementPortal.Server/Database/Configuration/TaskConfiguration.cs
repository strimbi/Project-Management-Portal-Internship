using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Util;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Database.Configuration
{
    public class TaskConfiguration : IEntityTypeConfiguration<Task>
    {
        public void Configure(EntityTypeBuilder<Task> builder)
        {
            builder.HasKey(t => t.Id);

            builder.Property(t => t.Id)
                .ValueGeneratedNever();

            builder.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(Constants.DefaultTextFieldLength);

            builder.Property(t =>t.Description)
                .HasMaxLength(Constants.DescriptionMaxLength);

            builder.Property(t => t.ProjectId)
                .IsRequired();

            builder.Property(t => t.Status)
                .IsRequired();

            builder.Property(t => t.StartDate)
                .IsRequired()
                .HasColumnType("date");

            builder.Property(t => t.EndDate)
                .HasColumnType("date");            

            builder.ToTable("Tasks", t =>
            {
                t.HasCheckConstraint("CK_Task_EndDate", "EndDate > StartDate");
            });
        }
    }
}
