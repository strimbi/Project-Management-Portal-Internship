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
    [Route("api/users")]
    public class UserController(UserService userService, ProjectService projectService) : ControllerBase
    {
        private readonly UserService _userService = userService;
        private readonly ProjectService _projectService = projectService;

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            return await _userService.GetAllUsers();
        }

        // GET: api/users/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUserById(Guid id)
        {
            var user = await _userService.GetUserById(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // GET: api/users/filtered/{projectId}
        [HttpGet("filtered/{projectId}")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsersNotAssignedAsResources(Guid projectId)
        {
            var allUsers = await _userService.GetAllUsers();

            var project = await _projectService.GetProjectById(projectId);
            var resources = project.Resources;

            var resourceUserIds = resources.Select(r => r.UserId);

            var filteredUsers = allUsers.Where(user => !resourceUserIds.Contains(user.Id)).ToList();

            return Ok(filteredUsers);
        }

        // GET: api/users/filtered-stakeholders/{projectId}
        [HttpGet("filtered-stakeholders/{projectId}")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsersNotAssignedAsStakeholders(Guid projectId)
        {
            var allUsers = await _userService.GetAllUsers();

            var project = await _projectService.GetProjectById(projectId);
            var stakeholders = project.Stakeholders;

            var stakeholdersUserIds = stakeholders.Select(r => r.UserId);

            var filteredUsers = allUsers.Where(user => !stakeholdersUserIds.Contains(user.Id)).ToList();

            return Ok(filteredUsers);
        }

        // GET: api/users/me
        [HttpGet("me")]
        public ActionResult<Guid> GetLoggedInUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            if (Guid.TryParse(userIdClaim.Value, out Guid userId))
            {
                return Ok(userId);
            }

            return StatusCode(500,"Invalid user ID format.");
        }
    }
}
