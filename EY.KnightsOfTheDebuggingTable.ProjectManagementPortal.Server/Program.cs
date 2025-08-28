
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Database;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Models;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Repositories;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Services;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Util;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json.Serialization;
using Task = System.Threading.Tasks.Task;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<AuthenticationDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("Database")));

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("Database")));

            builder.Services.AddMvc().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });

            builder.Services.AddAuthorization();
            builder.Services
                .AddAuthentication()
                .AddCookie(IdentityConstants.ApplicationScheme, options =>
                {
                    options.Events = new CookieAuthenticationEvents()
                    {
                        OnRedirectToLogin = context =>
                        {
                            context.Response.StatusCode = StatusCodes.Status401Unauthorized;

                            return Task.CompletedTask;
                        }
                    };
                });

            builder.Services.AddIdentityCore<User>()
                .AddEntityFrameworkStores<AuthenticationDbContext>()
                .AddApiEndpoints();

            builder.Services.AddAutoMapper(typeof(MappingProfile));
            builder.Services.AddScoped<ProjectRepository>();
            builder.Services.AddScoped<ProjectService>();
            builder.Services.AddScoped<TemplateRepository>();
            builder.Services.AddScoped<TemplateService>();
            builder.Services.AddScoped<StageRepository>();
            builder.Services.AddScoped<StageService>();
            builder.Services.AddScoped<StakeholderService>();
            builder.Services.AddScoped<UserService>();
            builder.Services.AddScoped<AdvanceRequestRepository>();
            builder.Services.AddScoped<AdvanceRequestService>();
            builder.Services.AddScoped<ApprovalRepository>();
            builder.Services.AddScoped<ApprovalService>();
            builder.Services.AddControllers();

            var app = builder.Build();

            app.UseHttpsRedirection();
            app.UseDefaultFiles();
            app.MapStaticAssets();

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapGroup("auth").MapIdentityApi<User>();
            app.MapGroup("auth").MapPost("logout", async (SignInManager<User> signInManager, [FromBody] object empty) =>
            {
                if (empty != null)
                {
                    await signInManager.SignOutAsync();

                    return Results.Ok();
                }

                return Results.Unauthorized();
            })
            .RequireAuthorization();
            app.MapGroup("auth").MapGet("status", (HttpContext httpContext) =>
            {
                var isAuthenticated = httpContext.User.Identity.IsAuthenticated;
                return Results.Ok(new { isAuthenticated });
            });

            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
