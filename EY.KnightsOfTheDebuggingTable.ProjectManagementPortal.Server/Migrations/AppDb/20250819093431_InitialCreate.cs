using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Migrations.AppDb
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Stages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Order = table.Column<int>(type: "int", nullable: false),
                    IsMandatory = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Templates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Templates", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    StartDate = table.Column<DateTime>(type: "date", nullable: false),
                    EndDate = table.Column<DateTime>(type: "date", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OwnerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TemplateId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CurrentStageId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                    table.CheckConstraint("CK_Project_EndDate", "EndDate > StartDate");
                    table.ForeignKey(
                        name: "FK_Projects_Stages_CurrentStageId",
                        column: x => x.CurrentStageId,
                        principalTable: "Stages",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Projects_Templates_TemplateId",
                        column: x => x.TemplateId,
                        principalTable: "Templates",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TemplateStages",
                columns: table => new
                {
                    StagesId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TemplatesId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TemplateStages", x => new { x.StagesId, x.TemplatesId });
                    table.ForeignKey(
                        name: "FK_TemplateStages_Stages_StagesId",
                        column: x => x.StagesId,
                        principalTable: "Stages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TemplateStages_Templates_TemplatesId",
                        column: x => x.TemplatesId,
                        principalTable: "Templates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AdvanceRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RequestedById = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CurrentStageId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NextStageId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RequestedAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    Status = table.Column<byte>(type: "tinyint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdvanceRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AdvanceRequests_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AdvanceRequests_Stages_CurrentStageId",
                        column: x => x.CurrentStageId,
                        principalTable: "Stages",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AdvanceRequests_Stages_NextStageId",
                        column: x => x.NextStageId,
                        principalTable: "Stages",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Resources",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Team = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Resources", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Resources_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Stakeholders",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stakeholders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Stakeholders_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ResourceId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ProjectId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "date", nullable: false),
                    EndDate = table.Column<DateTime>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tasks", x => x.Id);
                    table.CheckConstraint("CK_Task_EndDate", "EndDate > StartDate");
                    table.ForeignKey(
                        name: "FK_Tasks_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Tasks_Resources_ResourceId",
                        column: x => x.ResourceId,
                        principalTable: "Resources",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Approvals",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StakeholderId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AdvanceRequestId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsApproved = table.Column<bool>(type: "bit", nullable: false),
                    ApprovedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Approvals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Approvals_AdvanceRequests_AdvanceRequestId",
                        column: x => x.AdvanceRequestId,
                        principalTable: "AdvanceRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Approvals_Stakeholders_StakeholderId",
                        column: x => x.StakeholderId,
                        principalTable: "Stakeholders",
                        principalColumn: "Id");
                });

            migrationBuilder.InsertData(
                table: "Stages",
                columns: new[] { "Id", "Description", "IsMandatory", "Name", "Order" },
                values: new object[,]
                {
                    { new Guid("43684a88-6020-46e8-b4fe-f52294224609"), "Stage for creating the project. This involves defining the project scope, objectives, and key stakeholders to ensure a clear understanding of what the project aims to achieve.", false, "Create", 1 },
                    { new Guid("5c11ce04-04f4-4234-b242-2d68d84f2fa5"), "Stage for closing the project. This includes finalizing all project activities, obtaining stakeholder approval, and conducting a post-project review to capture lessons learned for future projects.", false, "Close", 5 },
                    { new Guid("66d76d76-83b4-47a0-bf05-678558c32351"), "Stage for planning the project. This includes developing a detailed project plan that outlines tasks, timelines, resources, and budget requirements to guide the execution phase.", false, "Plan", 2 },
                    { new Guid("cc659f0e-fdec-47a2-a0bf-6a3f72b22f94"), "Stage for executing the project. During this phase, the project team carries out the tasks defined in the project plan, ensuring that deliverables are produced on time and within budget.", true, "Execute", 3 },
                    { new Guid("dc44b7ac-dcce-4411-bffa-4a7f710a3086"), "Stage for monitoring the project. This involves tracking progress against the project plan, identifying any deviations, and implementing corrective actions to keep the project on track.", false, "Monitor", 4 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdvanceRequests_CurrentStageId",
                table: "AdvanceRequests",
                column: "CurrentStageId");

            migrationBuilder.CreateIndex(
                name: "IX_AdvanceRequests_NextStageId",
                table: "AdvanceRequests",
                column: "NextStageId");

            migrationBuilder.CreateIndex(
                name: "IX_AdvanceRequests_ProjectId",
                table: "AdvanceRequests",
                column: "ProjectId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Approvals_AdvanceRequestId",
                table: "Approvals",
                column: "AdvanceRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_Approvals_StakeholderId",
                table: "Approvals",
                column: "StakeholderId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_CurrentStageId",
                table: "Projects",
                column: "CurrentStageId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_Name",
                table: "Projects",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Projects_TemplateId",
                table: "Projects",
                column: "TemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_Resources_ProjectId",
                table: "Resources",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Stages_Name",
                table: "Stages",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Stakeholders_ProjectId",
                table: "Stakeholders",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_ProjectId",
                table: "Tasks",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_ResourceId",
                table: "Tasks",
                column: "ResourceId");

            migrationBuilder.CreateIndex(
                name: "IX_Templates_Name",
                table: "Templates",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TemplateStages_TemplatesId",
                table: "TemplateStages",
                column: "TemplatesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Approvals");

            migrationBuilder.DropTable(
                name: "Tasks");

            migrationBuilder.DropTable(
                name: "TemplateStages");

            migrationBuilder.DropTable(
                name: "AdvanceRequests");

            migrationBuilder.DropTable(
                name: "Stakeholders");

            migrationBuilder.DropTable(
                name: "Resources");

            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "Stages");

            migrationBuilder.DropTable(
                name: "Templates");
        }
    }
}
