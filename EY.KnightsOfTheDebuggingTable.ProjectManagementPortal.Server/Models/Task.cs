using System;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models
{
    public class Task
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid? ResourceId { get; set; }
        public Guid ProjectId { get; set; }
        public TaskStatus Status { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public Resource Resource { get; set; }
        public Project Project { get; set; }
    }
}
