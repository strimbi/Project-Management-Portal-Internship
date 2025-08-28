using System;
using System.Collections.Generic;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.DTOs
{
    public class TemplateDto
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid? CreatedBy { get; set; }

        public List<StageDto> Stages { get; set; }
    }
}
