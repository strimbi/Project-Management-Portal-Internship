using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Migrations.AppDb
{
    /// <inheritdoc />
    public partial class MultipleAdvanceRequests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AdvanceRequests_ProjectId",
                table: "AdvanceRequests");

            migrationBuilder.CreateIndex(
                name: "IX_AdvanceRequests_ProjectId",
                table: "AdvanceRequests",
                column: "ProjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AdvanceRequests_ProjectId",
                table: "AdvanceRequests");

            migrationBuilder.CreateIndex(
                name: "IX_AdvanceRequests_ProjectId",
                table: "AdvanceRequests",
                column: "ProjectId",
                unique: true);
        }
    }
}
