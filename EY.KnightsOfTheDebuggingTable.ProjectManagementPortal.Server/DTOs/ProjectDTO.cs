using System;
using System.Collections;
using System.Collections.Generic;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.DTOs
{
    public class ProjectDto
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public Guid? CreatedBy { get; set; }
        public Guid TemplateId { get; set; }
        public Guid OwnerId { get; set; }
        public StageDto CurrentStage { get; set; }

        public IEnumerable<TaskDto> Tasks { get; set; }
        public IEnumerable<ResourceDto> Resources { get; set; } 
        public IEnumerable<StakeholderDto> Stakeholders { get; set; }
    }
}
