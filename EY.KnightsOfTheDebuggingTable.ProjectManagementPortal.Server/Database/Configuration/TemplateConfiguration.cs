using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Util;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Database.Configuration
{
    public class TemplateConfiguration : IEntityTypeConfiguration<Template>
    {
        public void Configure(EntityTypeBuilder<Template> builder)
        {
            builder.HasKey(t => t.Id);

            builder.Property(t => t.Id)
                .ValueGeneratedNever();

            builder.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(Constants.DefaultTextFieldLength);

            builder.HasIndex(t => t.Name)
                .IsUnique();

            builder.Property(t => t.Description)
                .HasMaxLength(Constants.DescriptionMaxLength);

            builder.Property(t => t.CreatedBy)
                .IsRequired();

            builder.HasMany(t => t.Stages)
                .WithMany()
                .UsingEntity(j => j.ToTable("TemplateStages"));
        }
    }
}
