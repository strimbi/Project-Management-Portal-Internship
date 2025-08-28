using System;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.DTOs
{
    public class StageDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Order { get; set; }
        public bool IsMandatory { get; set; }
    }
}
