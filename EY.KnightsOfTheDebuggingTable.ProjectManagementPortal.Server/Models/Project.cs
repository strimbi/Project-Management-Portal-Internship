using System;
using System.Collections.Generic;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models
{
        public class Project
        {
                public Guid Id { get; set; }
                public string Name { get; set; }
                public string Description { get; set; }
                public DateTime StartDate { get; set; }
                public DateTime? EndDate { get; set; }
                public Guid CreatedBy { get; set; }

                public Guid OwnerId { get; set; }
                public Guid TemplateId { get; set; }
                public Guid CurrentStageId { get; set; }
                public Template Template { get; set; }
                public Stage CurrentStage { get; set; }

                public ICollection<AdvanceRequest> AdvanceRequests { get; set; }
                public ICollection<Stakeholder> Stakeholders { get; set; } = [];
                public ICollection<Task> Tasks { get; set; } = [];
                public ICollection<Resource> Resources { get; set; } = [];
                public Project() { }
        }
}
