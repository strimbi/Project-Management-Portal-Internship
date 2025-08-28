using System;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models
{
    public class Approval
    {
        public Guid Id { get; set; }
        public Guid StakeholderId { get; set; }
        public Guid AdvanceRequestId { get; set; }
        public ApprovalStatus Status { get; set; }
        public DateTime? ApprovedAt { get; set; }

        public Stakeholder Stakeholder { get; set; }
        public AdvanceRequest AdvanceRequest { get; set; }
    }
}
