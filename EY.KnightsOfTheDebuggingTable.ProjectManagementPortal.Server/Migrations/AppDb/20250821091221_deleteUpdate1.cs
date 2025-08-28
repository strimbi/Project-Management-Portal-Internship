using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Migrations.AppDb
{
    /// <inheritdoc />
    public partial class deleteUpdate1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Approvals_Stakeholders_StakeholderId",
                table: "Approvals");

            migrationBuilder.DropForeignKey(
                name: "FK_Stakeholders_Projects_ProjectId",
                table: "Stakeholders");

            migrationBuilder.AddForeignKey(
                name: "FK_Approvals_Stakeholders_StakeholderId",
                table: "Approvals",
                column: "StakeholderId",
                principalTable: "Stakeholders",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Stakeholders_Projects_ProjectId",
                table: "Stakeholders",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Approvals_Stakeholders_StakeholderId",
                table: "Approvals");

            migrationBuilder.DropForeignKey(
                name: "FK_Stakeholders_Projects_ProjectId",
                table: "Stakeholders");

            migrationBuilder.AddForeignKey(
                name: "FK_Approvals_Stakeholders_StakeholderId",
                table: "Approvals",
                column: "StakeholderId",
                principalTable: "Stakeholders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Stakeholders_Projects_ProjectId",
                table: "Stakeholders",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id");
        }
    }
}
