using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Migrations.AppDb
{
    /// <inheritdoc />
    public partial class updateapproval : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsApproved",
                table: "Approvals");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Approvals",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Approvals");

            migrationBuilder.AddColumn<bool>(
                name: "IsApproved",
                table: "Approvals",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
