using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Util;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Database.Configuration
{
    public class ResourceConfiguration : IEntityTypeConfiguration<Resource>
    {
        public void Configure(EntityTypeBuilder<Resource> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.Id)
                .ValueGeneratedNever();          

            builder.Property(r => r.ProjectId)
                .IsRequired();

            builder.Property(r => r.UserId)
                .IsRequired();

            builder.Property(r => r.Role)
                .IsRequired();  

            builder.Property(r => r.FirstName)
                .IsRequired()
                .HasMaxLength(Constants.DefaultTextFieldLength);

            builder.Property(r => r.LastName)
                .IsRequired()
                .HasMaxLength(Constants.DefaultTextFieldLength);

            builder.Property(r => r.Team)
                .HasMaxLength(Constants.DefaultTextFieldLength);        

            builder.HasMany(x => x.Tasks)
                .WithOne(r => r.Resource)
                .HasForeignKey(r => r.ResourceId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
