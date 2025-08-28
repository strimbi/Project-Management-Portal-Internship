using System;
using System.Collections.Generic;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models
{
    public class AdvanceRequest
    {
        public Guid Id { get; set; }
        public Guid ProjectId { get; set; }
        public Guid RequestedById { get; set; }
        public Guid CurrentStageId { get; set; }
        public Guid NextStageId { get; set; }
        public DateTime RequestedAt { get; set; }
        public ApprovalStatus Status { get; set; }

        public ICollection<Approval> Approvals { get; set; }
        public Project Project { get; set; }
        public Stage CurrentStage { get; set; }
        public Stage NextStage { get; set; }
    }
}
