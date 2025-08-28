using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using System;
using System.Collections.Generic;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.DTOs
{
    public class AdvanceRequestDto
    {
        public Guid? Id { get; set; }
        public Guid ProjectId { get; set; }
        public Guid? RequestedById { get; set; }
        public Guid CurrentStageId { get; set; }
        public Guid? NextStageId { get; set; }
        public DateTime RequestedAt { get; set; }
        public ApprovalStatus Status { get; set; }

        public ProjectDto Project { get; set; }
        public List<ApprovalDto> Approvals { get; set; }
    }
}
