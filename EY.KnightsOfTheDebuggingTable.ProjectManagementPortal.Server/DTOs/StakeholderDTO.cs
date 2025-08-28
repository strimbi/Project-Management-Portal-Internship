using System;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.DTOs
{
    public class StakeholderDto
    {
        public Guid? Id { get; set; }
        public Guid UserId { get; set; }
        public Guid ProjectId { get; set; }
        public string Role { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
    }
}
