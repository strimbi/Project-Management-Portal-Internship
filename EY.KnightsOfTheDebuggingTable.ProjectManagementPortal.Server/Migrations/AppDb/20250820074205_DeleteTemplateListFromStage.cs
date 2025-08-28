using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Migrations.AppDb
{
    /// <inheritdoc />
    public partial class DeleteTemplateListFromStage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TemplateStages_Templates_TemplatesId",
                table: "TemplateStages");

            migrationBuilder.RenameColumn(
                name: "TemplatesId",
                table: "TemplateStages",
                newName: "TemplateId");

            migrationBuilder.RenameIndex(
                name: "IX_TemplateStages_TemplatesId",
                table: "TemplateStages",
                newName: "IX_TemplateStages_TemplateId");

            migrationBuilder.AddForeignKey(
                name: "FK_TemplateStages_Templates_TemplateId",
                table: "TemplateStages",
                column: "TemplateId",
                principalTable: "Templates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TemplateStages_Templates_TemplateId",
                table: "TemplateStages");

            migrationBuilder.RenameColumn(
                name: "TemplateId",
                table: "TemplateStages",
                newName: "TemplatesId");

            migrationBuilder.RenameIndex(
                name: "IX_TemplateStages_TemplateId",
                table: "TemplateStages",
                newName: "IX_TemplateStages_TemplatesId");

            migrationBuilder.AddForeignKey(
                name: "FK_TemplateStages_Templates_TemplatesId",
                table: "TemplateStages",
                column: "TemplatesId",
                principalTable: "Templates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
