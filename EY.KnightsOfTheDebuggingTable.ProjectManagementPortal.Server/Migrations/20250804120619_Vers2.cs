using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Migrations
{
    /// <inheritdoc />
    public partial class Vers2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Projects",
                schema: "identity");

            migrationBuilder.DropColumn(
                name: "FirstName",
                schema: "identity",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LastName",
                schema: "identity",
                table: "AspNetUsers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                schema: "identity",
                table: "AspNetUsers",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                schema: "identity",
                table: "AspNetUsers",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Projects",
                schema: "identity",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    EndDate = table.Column<DateTime>(type: "date", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    StartDate = table.Column<DateTime>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                    table.CheckConstraint("CK_Project_EndDate", "EndDate > StartDate");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Projects_Name",
                schema: "identity",
                table: "Projects",
                column: "Name",
                unique: true);
        }
    }
}
