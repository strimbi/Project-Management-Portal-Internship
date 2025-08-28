using System;
using System.Collections.Generic;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models
{
    public class Template
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid CreatedBy { get; set; }

        public ICollection<Stage> Stages { get; set; }
        public ICollection<Project> Projects { get; set; }
    }
}
