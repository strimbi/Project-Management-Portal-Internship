namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.DTOs
{
    public class ProjectTaskStatusDto
    {
        public string projectName { get; set; }
        public int notStarted { get; set; }
        public int inProgress { get; set; }
        public int onHold { get; set; }
        public int completed { get; set; }
    }
}
