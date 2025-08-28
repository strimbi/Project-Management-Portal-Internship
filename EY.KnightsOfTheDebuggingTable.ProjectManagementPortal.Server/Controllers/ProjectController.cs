using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.DTOs;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/projects")]
    public class ProjectController(ProjectService projectService) : ControllerBase
    {
        private readonly ProjectService _projectService = projectService;

        // GET: api/projects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var projects = await _projectService.GetAllProjectsByUserId(userId);

            return Ok(projects);
        }

        // GET: api/projects/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDto>> GetProjectById(Guid id)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var project = await _projectService.GetProjectById(id);

            if (project == null)
            {
                return NotFound();
            }

            if (project.CreatedBy != userId && project.OwnerId != userId
                && !project.Resources.Select(r => r.UserId).Contains(userId)
                && !project.Stakeholders.Select(s => s.UserId).Contains(userId))
            {
                return Unauthorized();
            }

            return Ok(project);
        }

        // GET: api/projects/progress
        [HttpGet("progress")]
        public async Task<ActionResult<Dictionary<string, int>>> GetProjectProgress()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var progress = await _projectService.GetProjectProgressByStage(userId);

            return Ok(progress);
        }

        // GET: api/projects/project-status
        [HttpGet("project-status")]
        public async Task<ActionResult<ProjectStatusDto>> GetProjectStatus()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var projects = await _projectService.GetAllProjectsByUserId(userId);

            int finalStageProjects = await _projectService.GetFinalStageProjectsCount(userId);

            int totalProjects = projects.Count;

            return Ok(new
            {
                finalStageProjects,
                totalProjects
            });
        }

        // GET: api/projects/project-tasks-status
        [HttpGet("project-tasks-status")]
        public async Task<ActionResult<ProjectTaskStatusDto>> GetProjectTasksStatus()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var projects = await _projectService.GetAllProjectsByUserId(userId);

            var projectTasksStatus = projects.Select(project => new
            {
                projectName = project.Name,
                notStarted = project.Tasks.Count(task => task.Status == Models.TaskStatus.NotStarted),
                inProgress = project.Tasks.Count(task => task.Status == Models.TaskStatus.InProgress),
                onHold = project.Tasks.Count(task => task.Status == Models.TaskStatus.OnHold),
                completed = project.Tasks.Count(task => task.Status == Models.TaskStatus.Completed)
            }).ToList();

            return Ok(projectTasksStatus);
        }

        //GET: api/projects/{projectId}/resources
        [HttpGet("{projectId}/resources")]
        public async Task<ActionResult<IEnumerable<ResourceDto>>> GetResourcesByProjectId(Guid projectId)
        {
            var project = await _projectService.GetProjectById(projectId);

            return project.Resources.ToList();
        }

        //GET: api/projects/{projectId}/tasks
        [HttpGet("{projectId}/tasks")]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasksByProjectId(Guid projectId)
        {
            var project = await _projectService.GetProjectById(projectId);

            return project.Tasks.ToList();
        }

        //GET: api/projects/{projectId}/resources/{resourceId}
        [HttpGet("{projectId}/resources/{resourceId}")]
        public async Task<ActionResult<ResourceDto>> GetResourceById(Guid projectId, Guid resourceId)
        {
            var resource = await _projectService.GetResourceById(projectId, resourceId);

            return resource;
        }

        //GET: api/projects/{projectId}/resources/{taskId}
        [HttpGet("{projectId}/tasks/{taskId}")]
        public async Task<ActionResult<TaskDto>> GetTaskById(Guid projectId, Guid taskId)
        {
            var task = await _projectService.GetTaskById(projectId, taskId);

            return task;
        }

        // POST: api/projects
        [HttpPost]
        public async Task<ActionResult<ProjectDto>> AddProject(ProjectDto projectDto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                projectDto.CreatedBy = Guid.Parse(userId);

                await _projectService.AddProject(projectDto);

                return CreatedAtAction(nameof(GetProjectById), new { id = projectDto.Id }, projectDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //POST: api/projects/{projectId}/tasks
        [HttpPost("{projectId}/tasks")]
        public async Task<ActionResult<TaskDto>> AddTask(TaskDto taskDto)
        {
            try
            {
                await _projectService.AddTask(taskDto);
                return CreatedAtAction(nameof(GetTaskById), new { projectId = taskDto.ProjectId, taskId = taskDto.Id }, taskDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }

        }

        //POST: api/projects/{projectId}/resources
        [HttpPost("{projectId}/resources")]
        public async Task<ActionResult<ResourceDto>> AddResource(ResourceDto resourceDto)
        {
            try
            {
                await _projectService.AddResource(resourceDto);
                return CreatedAtAction(nameof(GetResourceById), new { projectId = resourceDto.ProjectId, resourceId = resourceDto.Id }, resourceDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/projects/{projectId}
        [HttpPut("{projectId}")]
        public async Task<IActionResult> UpdateProject(Guid projectId, ProjectDto projectDto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var existingProject = await _projectService.GetProjectById(projectId);

            if (existingProject == null)
            {
                return NotFound();
            }

            if (existingProject.CreatedBy != userId && existingProject.OwnerId != userId)
            {
                return Unauthorized();
            }

            try
            {
                await _projectService.UpdateProject(projectId, projectDto);

                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/projects/{projectId}/resources
        [HttpPut("{projectId}/resources")]
        public async Task<IActionResult> UpdateResource(Guid projectId, ResourceDto resourceDto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var existingProject = await _projectService.GetProjectById(projectId);

            if (existingProject == null)
            {
                return NotFound();
            }

            if (existingProject.CreatedBy != userId && existingProject.OwnerId != userId)
            {
                return Unauthorized();
            }

            try
            {
                await _projectService.UpdateResource(projectId, resourceDto);

                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/projects/{projectId}/tasks
        [HttpPut("{projectId}/tasks")]
        public async Task<IActionResult> UpdateTask(Guid projectId, TaskDto taskDto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var existingProject = await _projectService.GetProjectById(projectId);

            if (existingProject == null)
            {
                return NotFound();
            }

            if (existingProject.CreatedBy != userId && existingProject.OwnerId != userId)
            {
                return Unauthorized();
            }

            try
            {
                await _projectService.UpdateTask(projectId, taskDto);

                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }


        // DELETE: api/projects/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(Guid id)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var project = await _projectService.GetProjectById(id);

            if (project == null)
            {
                return NotFound();
            }

            if (project.CreatedBy != userId && project.OwnerId != userId)
            {
                return Unauthorized();
            }

            await _projectService.DeleteProject(id);
            return NoContent();
        }

        // DELETE: api/projects/{projectId}/resources/{resourceId}
        [HttpDelete("{projectId}/resources/{resourceId}")]
        public async Task<IActionResult> DeleteResourceFromProject(Guid projectId, Guid resourceId)
        {
            var project = await _projectService.GetProjectById(projectId);
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (project == null)
            {
                return NotFound();
            }

            if (project.CreatedBy != userId)
            {
                return Unauthorized();
            }

            await _projectService.DeleteResourceFromProject(projectId, resourceId);
            return NoContent();
        }

        // DELETE: api/projects/{projectId}/tasks/{taskId}
        [HttpDelete("{projectId}/tasks/{taskId}")]
        public async Task<IActionResult> DeleteTaskFromProject(Guid projectId, Guid taskid)
        {
            var project = await _projectService.GetProjectById(projectId);
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (project == null)
            {
                return NotFound();
            }

            if (project.CreatedBy != userId)
            {
                return Unauthorized();
            }

            await _projectService.DeleteTaskFromProject(projectId, taskid);
            return NoContent();
        }
    }
}
