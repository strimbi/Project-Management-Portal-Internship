using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using System;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.DTOs
{
    public class ApprovalDto
    {
        public Guid? Id { get; set; }
        public Guid StakeholderId { get; set; }
        public Guid AdvanceRequestId { get; set; }
        public ApprovalStatus Status { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public string ProjectName { get; set; }
        public string CurrentStageName { get; set; }
        public string NextStageName { get; set; }
    }
}
