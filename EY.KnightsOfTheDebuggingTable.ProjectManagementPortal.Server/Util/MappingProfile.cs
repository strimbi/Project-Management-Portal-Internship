using AutoMapper;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.DTOs;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Util
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Project, ProjectDto>().ReverseMap();
            CreateMap<Stage, StageDto>().ReverseMap();
            CreateMap<Template, TemplateDto>().ReverseMap();
            CreateMap<Resource, ResourceDto>().ReverseMap();

            CreateMap<Task, TaskDto>()
             .ForMember(dest => dest.ResourceName, opt => opt.MapFrom(src => $"{src.Resource.FirstName} {src.Resource.LastName}"));
            CreateMap<TaskDto, Task>();

            CreateMap<Stakeholder, StakeholderDto>().ReverseMap();

            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<AdvanceRequest, AdvanceRequestDto>().ReverseMap();
            CreateMap<Approval, ApprovalDto>()
                .ForMember(dest => dest.ProjectName, opt => opt.MapFrom(src => src.AdvanceRequest.Project.Name))
                .ForMember(dest => dest.CurrentStageName, opt => opt.MapFrom(src => src.AdvanceRequest.CurrentStage.Name))
                .ForMember(dest => dest.NextStageName, opt => opt.MapFrom(src => src.AdvanceRequest.NextStage.Name));
            CreateMap<ApprovalDto, Approval>();
        }
    }
}
