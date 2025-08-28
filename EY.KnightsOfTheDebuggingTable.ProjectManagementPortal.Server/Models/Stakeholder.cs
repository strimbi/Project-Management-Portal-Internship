using System;
using System.Collections.Generic;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models
{
    public class Stakeholder
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid ProjectId { get; set; }
        public string Role { get; set; }
        public Project Project { get; set; }

        public ICollection<Approval> Approvals { get; set; }
        public Stakeholder() { }
    }
}
