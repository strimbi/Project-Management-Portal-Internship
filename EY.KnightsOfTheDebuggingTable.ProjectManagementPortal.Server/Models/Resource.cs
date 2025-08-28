using System;
using System.Collections.Generic;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models
{
    public class Resource
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public ResourceRole Role { get; set; }
        public Guid ProjectId { get; set; }
        public Guid UserId { get; set; } 
        public string Team {  get; set; }     
        public Project Project { get; set; }

        public ICollection<Task> Tasks { get; set; } = [];

    }
}
