using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using System;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Util
{
    public static class Constants
    {
        public const int DefaultTextFieldLength = 250;
        public const int DescriptionMaxLength = 500;

        public static readonly Stage[] DefinedStages =
        {
            new()
            {
                Id = new Guid("43684a88-6020-46e8-b4fe-f52294224609"),
                Name = "Create",
                Description = "Stage for creating the project. This involves defining the project scope, objectives, and key stakeholders to ensure a clear understanding of what the project aims to achieve.",
                Order = 1,
                IsMandatory = false,             
            },
            new()
            {
                Id = new Guid("66d76d76-83b4-47a0-bf05-678558c32351"),
                Name = "Plan",
                Description = "Stage for planning the project. This includes developing a detailed project plan that outlines tasks, timelines, resources, and budget requirements to guide the execution phase.",
                Order = 2,
                IsMandatory = false,
            },
            new()
            {
                Id = new Guid("cc659f0e-fdec-47a2-a0bf-6a3f72b22f94"),
                Name = "Execute",
                Description = "Stage for executing the project. During this phase, the project team carries out the tasks defined in the project plan, ensuring that deliverables are produced on time and within budget.",
                Order = 3,
                IsMandatory = true,
            },
            new()
            {
                Id = new Guid("dc44b7ac-dcce-4411-bffa-4a7f710a3086"),
                Name = "Monitor",
                Description = "Stage for monitoring the project. This involves tracking progress against the project plan, identifying any deviations, and implementing corrective actions to keep the project on track.",
                Order = 4,
                IsMandatory = false,
            },
            new()
            {
                Id = new Guid("5c11ce04-04f4-4234-b242-2d68d84f2fa5"),
                Name = "Close",
                Description = "Stage for closing the project. This includes finalizing all project activities, obtaining stakeholder approval, and conducting a post-project review to capture lessons learned for future projects.",
                Order = 5,
                IsMandatory = false,
            }
        };
    }
}
