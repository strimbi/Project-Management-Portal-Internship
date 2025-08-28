using System;
using System.Collections.Generic;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models
{
    public class Stage
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Order { get; set; }
        public bool IsMandatory { get; set; }
    }
}
