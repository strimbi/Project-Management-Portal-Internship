using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Util;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Database.Configuration
{
    public class StageConfiguration : IEntityTypeConfiguration<Stage>
    {
        public void Configure(EntityTypeBuilder<Stage> builder)
        {
            builder.HasKey(s => s.Id);

            builder.Property(s => s.Id)
                .ValueGeneratedNever();

            builder.Property(s => s.Name)
                .IsRequired()
                .HasMaxLength(Constants.DefaultTextFieldLength);

            builder.HasIndex(s => s.Name)
                .IsUnique();

            builder.Property(s => s.Description)
                .HasMaxLength(Constants.DefaultTextFieldLength);

            builder.Property(s => s.Order)
                .IsRequired();

            builder.Property(s => s.IsMandatory)
                .IsRequired();

            builder.HasData(Constants.DefinedStages);
        }
    }
}
