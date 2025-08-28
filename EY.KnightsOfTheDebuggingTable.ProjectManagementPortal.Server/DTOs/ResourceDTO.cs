using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using System;
using System.Collections.Generic;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.DTOs
{
    public class ResourceDto
    {
        public Guid? Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public ResourceRole Role { get; set; }
        public Guid ProjectId { get; set; }
        public Guid UserId { get; set; }
        public string Team { get; set; }
        public string Email { get; set; }

        public IEnumerable<TaskDto> Tasks { get; set; }
    }
}
