using AutoMapper;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Database;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.DTOs;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Repositories;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Util;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Task = System.Threading.Tasks.Task;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Services
{
    public class ProjectService(ProjectRepository repository, TemplateRepository templateRepository, AppDbContext context, IMapper mapper)
    {
        private readonly ProjectRepository _repository = repository;
        private readonly TemplateRepository _templateRepository = templateRepository;
        private readonly AppDbContext _context = context;
        private readonly IMapper _mapper = mapper;

        public async Task<List<ProjectDto>> GetAllProjects()
        {
            var projects = await _repository.GetAllProjects();

            return _mapper.Map<List<ProjectDto>>(projects);
        }

        public async Task<List<TaskDto>> GetAllTasks(Guid id)
        {
            var project = await _repository.GetProjectById(id);
            var tasks = project.Tasks;

            return _mapper.Map<List<TaskDto>>(tasks);
        }

        public async Task<List<ResourceDto>> GetAllResources(Guid id)
        {
            var project = await _repository.GetProjectById(id);
            var resources = project.Resources;

            return _mapper.Map<List<ResourceDto>>(resources);
        }

        public async Task<List<ProjectDto>> GetAllProjectsByUserId(Guid userId)
        {
            var projects = await _repository.GetAllProjectsByUserId(userId);

            return _mapper.Map<List<ProjectDto>>(projects);
        }

        public async Task<ProjectDto> GetProjectById(Guid id)
        {
            var project = await _repository.GetProjectById(id);

            return _mapper.Map<ProjectDto>(project);
        }

        public async ValueTask<ResourceDto> GetResourceById(Guid projectId, Guid resourceId)
        {
            var project = await _repository.GetProjectById(projectId);
            var resource = project.Resources.FirstOrDefault(r => r.Id == resourceId);

            return _mapper.Map<ResourceDto>(resource);
        }

        public async ValueTask<TaskDto> GetTaskById(Guid projectId, Guid taskId)
        {
            var project = await _repository.GetProjectById(projectId);
            var task = project.Tasks.FirstOrDefault(r => r.Id == taskId);

            var taskDto = _mapper.Map<TaskDto>(task);

            if (task.Resource != null)
            {
                taskDto.ResourceName = task.Resource.FirstName + task.Resource.LastName;
            }

            return taskDto;
        }

        public async Task<ProjectDto> GetProjectByName(string name)
        {
            var project = await _repository.GetProjectByName(name);

            return _mapper.Map<ProjectDto>(project);
        }

        public async Task<List<StakeholderDto>> GetAllStakeholders(Guid id)
        {
            var project = await _repository.GetProjectById(id);
            var stakeholders = project.Stakeholders;

            return _mapper.Map<List<StakeholderDto>>(stakeholders);
        }

        public async Task<Dictionary<string, int>> GetProjectProgressByStage(Guid userId)
        {
            var projects = await _repository.GetAllProjectsByUserId(userId);
            var progress = new Dictionary<string, int>();
            int totalProjects = projects.Count;
            var stages = await _context.Stages.OrderBy(s => s.Order).ToListAsync();

            foreach (var stage in stages)
            {
                progress[stage.Name] = 0;
            }

            foreach (var project in projects)
            {
                if (project.CurrentStage != null && progress.ContainsKey(project.CurrentStage.Name))
                {
                    progress[project.CurrentStage.Name]++;
                }
            }

            return progress;
        }

        public async Task<int> GetFinalStageProjectsCount(Guid userId)
        {
            var projects = await _repository.GetAllProjectsByUserId(userId);
            var count = 0;

            foreach (var project in projects)
            {
                var nextStage = project.Template.Stages
                    .Where(s => s.Order > project.CurrentStage.Order)
                    .OrderBy(s => s.Order)
                    .FirstOrDefault();

                if (nextStage == null)
                {
                    count += 1;
                }
            }

            return count;
        }

        public async Task AddProject(ProjectDto projectDto)
        {
            projectDto.Id = Guid.NewGuid();
            var validationErrors = await ValidateProject(projectDto);

            if (validationErrors.Count != 0)
            {
                throw new ArgumentException(string.Join(", ", validationErrors));
            }

            var template = await _templateRepository.GetTemplateById(projectDto.TemplateId);
            var currentStage = template.Stages.OrderBy(s => s.Order).First();

            var project = _mapper.Map<Project>(projectDto);

            project.Template = template;
            project.CurrentStage = currentStage;

            _context.Projects.Add(project);

            await _context.SaveChangesAsync();
        }

        public async Task AddTask(TaskDto taskDto)
        {
            var project = await _repository.GetProjectById(taskDto.ProjectId) ?? throw new ArgumentException("Project not found");

            taskDto.Id = Guid.NewGuid();
            var validationErrors = await ValidateTask(taskDto);

            if (validationErrors.Count != 0)
            {
                throw new ArgumentException(string.Join(", ", validationErrors));
            }

            var task = new Models.Task
            {
                Id = (Guid)taskDto.Id,
                Name = taskDto.Name,
                Description = taskDto.Description,
                ResourceId = taskDto.ResourceId,
                ProjectId = taskDto.ProjectId,
                Status = taskDto.Status,
                StartDate = taskDto.StartDate,
                EndDate = taskDto.EndDate,
            };

            project.Tasks.Add(task);

            await _context.SaveChangesAsync();
        }

        public async Task AddResource(ResourceDto resourceDto)
        {
            var project = await _repository.GetProjectById(resourceDto.ProjectId) ?? throw new ArgumentException("Project not found");

            var validationErrors = await ValidateResource(resourceDto);

            if (validationErrors.Count != 0)
            {
                throw new ArgumentException(string.Join(", ", validationErrors));
            }

            var resource = new Resource
            {
                Id = Guid.NewGuid(),
                FirstName = resourceDto.FirstName,
                LastName = resourceDto.LastName,
                Role = resourceDto.Role,
                ProjectId = resourceDto.ProjectId,
                UserId = resourceDto.UserId,
                Team = resourceDto.Team,
            };

            resourceDto.Id = resource.Id;

            project.Resources.Add(resource);

            await _context.SaveChangesAsync();
        }


        public async Task UpdateProject(Guid id, ProjectDto projectDto)
        {
            var existingProject = await _repository.GetProjectById(id) ?? throw new ArgumentException("Project not found.");
            projectDto.Id = id;
            projectDto.CreatedBy = existingProject.CreatedBy;

            var validationErrors = await ValidateProject(projectDto);

            if (validationErrors.Count != 0)
            {
                throw new ArgumentException(string.Join(", ", validationErrors));
            }

            var project = _mapper.Map<Project>(projectDto);

            existingProject.Name = project.Name;
            existingProject.Description = project.Description;
            existingProject.StartDate = project.StartDate;
            existingProject.EndDate = project.EndDate;

            await context.SaveChangesAsync();
        }

        public async Task UpdateTask(Guid id, TaskDto taskDto)
        {
            var existingProject = await _repository.GetProjectById(id) ?? throw new ArgumentException("Project not found.");
            var existingTask = existingProject.Tasks.FirstOrDefault(x => x.Id == taskDto.Id) ?? throw new ArgumentException("Task not found.");

            var validationErrors = await ValidateTask(taskDto);

            if (validationErrors.Count != 0)
            {
                throw new ArgumentException(string.Join(", ", validationErrors));
            }

            var task = _mapper.Map<Models.Task>(taskDto);

            existingTask.Name = task.Name;
            existingTask.Description = task.Description;
            existingTask.ResourceId = task.ResourceId;
            existingTask.Status = task.Status;
            existingTask.StartDate = task.StartDate;
            existingTask.EndDate = task.EndDate;

            await _context.SaveChangesAsync();
        }

        public async Task UpdateResource(Guid id, ResourceDto resourceDto)
        {
            var existingProject = await _repository.GetProjectById(id) ?? throw new ArgumentException("Project not found.");
            var existingResource = existingProject.Resources.FirstOrDefault(x => x.Id == resourceDto.Id) ?? throw new ArgumentException("Task not found.");

            var validationErrors = await ValidateResource(resourceDto);

            if (validationErrors.Count != 0)
            {
                throw new ArgumentException(string.Join(", ", validationErrors));
            }

            var resource = _mapper.Map<Resource>(resourceDto);

            existingResource.FirstName = resource.FirstName;
            existingResource.LastName = resource.LastName;
            existingResource.Role = resource.Role;
            existingResource.UserId = resource.UserId;
            existingResource.Team = resource.Team;

            await _context.SaveChangesAsync();
        }

        public async System.Threading.Tasks.Task DeleteProject(Guid id)
        {
            var project = await _repository.GetProjectById(id);

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteResourceFromProject(Guid projectId, Guid resourceId)
        {
            var project = await _repository.GetProjectById(projectId);

            var resourceToDelete = project.Resources.FirstOrDefault(x => x.Id == resourceId);

            if (resourceToDelete != null)
            {
                project.Resources.Remove(resourceToDelete);

                await _context.SaveChangesAsync();
            }
            else
            {
                throw new Exception("Resource not found.");
            }
        }

        public async Task DeleteTaskFromProject(Guid projectId, Guid taskId)
        {
            var project = await _repository.GetProjectById(projectId);

            var taskToDelete = project.Tasks.FirstOrDefault(x => x.Id == taskId);

            if (taskToDelete != null)
            {
                project.Tasks.Remove(taskToDelete);

                await _context.SaveChangesAsync();
            }
            else
            {
                throw new Exception("Task not found.");
            }
        }

        private async Task<List<string>> ValidateProject(ProjectDto projectDto)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(projectDto.Name))
            {
                errors.Add("Name is required.");
            }

            if (projectDto.Name.Length > Constants.DefaultTextFieldLength)
            {
                errors.Add($"Name is longer than {Constants.DefaultTextFieldLength} characters.");
            }

            if (projectDto.Description.Length > Constants.DescriptionMaxLength)
            {
                errors.Add($"Description is longer than {Constants.DescriptionMaxLength} characters.");
            }

            if (projectDto.EndDate.HasValue && projectDto.EndDate <= projectDto.StartDate)
            {
                errors.Add("End date must be after start date");
            }

            var template = await _templateRepository.GetTemplateById(projectDto.TemplateId);

            if (template == null)
            {
                errors.Add("The provided TemplateId is invalid.");
            }

            var existingProject = await _repository.GetProjectByName(projectDto.Name);

            if (existingProject != null && projectDto.Id != null && existingProject.Id != projectDto.Id)
            {
                errors.Add("Name already exists.");
            }

            return errors;
        }

        private async Task<List<string>> ValidateTask(TaskDto taskDto)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(taskDto.Name))
            {
                errors.Add("Name is required.");
            }

            if (taskDto.Name.Length > Constants.DefaultTextFieldLength)
            {
                errors.Add($"Name is longer than {Constants.DefaultTextFieldLength} characters.");
            }

            if (taskDto.Description.Length > Constants.DescriptionMaxLength)
            {
                errors.Add($"Description is longer than {Constants.DescriptionMaxLength} characters.");
            }

            if (taskDto.EndDate.HasValue && taskDto.EndDate <= taskDto.StartDate)
            {
                errors.Add("End date must be after start date");
            }

            var existingTask = await _context.Tasks.FirstOrDefaultAsync(t => t.Name == taskDto.Name);

            if (existingTask != null && taskDto.Id != null && existingTask.Id != taskDto.Id && existingTask.ProjectId == taskDto.ProjectId)
            {
                errors.Add("Name already exists.");
            }

            return errors;
        }

        private async Task<List<string>> ValidateResource(ResourceDto resourceDto)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(resourceDto.FirstName))
            {
                errors.Add("First Name is required.");
            }

            if (resourceDto.FirstName.Length > Constants.DefaultTextFieldLength)
            {
                errors.Add($"First Name is longer than {Constants.DefaultTextFieldLength} characters.");
            }

            if (string.IsNullOrWhiteSpace(resourceDto.LastName))
            {
                errors.Add("Last Name is required.");
            }

            if (resourceDto.LastName.Length > Constants.DefaultTextFieldLength)
            {
                errors.Add($"Last Name is longer than {Constants.DefaultTextFieldLength} characters.");
            }

            if (!Enum.IsDefined(resourceDto.Role))
            {
                errors.Add("Role is invalid");
            }

            return errors;
        }

    }
}
