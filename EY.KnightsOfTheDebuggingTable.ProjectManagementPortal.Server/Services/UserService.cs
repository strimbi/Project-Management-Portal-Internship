using AutoMapper;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.DTOs;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Services
{
    public class UserService(UserManager<User> userManager, IMapper mapper)
    {
        private readonly UserManager<User> _userManager = userManager;
        private readonly IMapper _mapper = mapper;

        public async Task<List<UserDto>> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();

            return _mapper.Map<List<UserDto>>(users);
        }

        public async Task<UserDto> GetUserById(Guid userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());

            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> GetUserByEmail(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            return _mapper.Map<UserDto>(user);
        }
    }
}
