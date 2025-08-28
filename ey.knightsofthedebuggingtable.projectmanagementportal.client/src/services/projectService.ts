import type { ProjectDto } from "../models/ProjectDto";
import {
  HEADERS,
  NAME_MAX_LENGTH,
  DESCRPTION_MAX_LENGTH,
} from "../util/constants";
import type { ResourceDto } from "../models/ResourceDto";
import type { TaskDto } from "../models/TaskDto";
import { TaskStatus } from "../models/TaskStatus";
import { ResourceRoles } from "../models/ResourceRole";
import type { ProjectStatusResponse } from "../models/ProjectStatusResponse";
import type { ProjectTaskStatus } from "../models/ProjectTaskStatusResponse";

export function getProjects(): Promise<ProjectDto[]> {
  return fetch("/api/projects", {
    method: "GET",
    headers: HEADERS,
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();

        throw new Error(
          `Error getting projects: ${error || response.statusText}`
        );
      }

      return response.json();
    })
    .then((result) => {
      return result.map((project: any) => ({
        ...project,
        startDate: new Date(project.startDate),
        endDate: project.endDate ? new Date(project.endDate) : null,
      })) as ProjectDto[];
    });
}

export function getProject(projectId: string): Promise<ProjectDto> {
  return fetch(`/api/projects/${projectId}`, {
    method: "GET",
    headers: HEADERS,
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();

        throw new Error(
          `Error getting project: ${error || response.statusText}`
        );
      }

      return response.json();
    })
    .then((result) => {
      const project: ProjectDto = {
        ...result,
        startDate: new Date(result.startDate),
        endDate: result.endDate ? new Date(result.endDate) : null,
      };

      return project;
    });
}

export function getProjectsProgress(): Promise<{ [key: string]: number }> {
  return fetch("/api/projects/progress", {
    method: "GET",
    headers: HEADERS,
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Error getting project progress: ${error || response.statusText}`
      );
    }
    return response.json();
  });
}

export function getProjectStatus(): Promise<ProjectStatusResponse> {
  return fetch("/api/projects/project-status", {
    method: "GET",
    headers: HEADERS,
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Error getting project status: ${error || response.statusText}`
      );
    }
    return response.json() as Promise<ProjectStatusResponse>;
  });
}

export function getProjectTasksStatus(): Promise<ProjectTaskStatus[]> {
  return fetch("/api/projects/project-tasks-status", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Error getting project tasks status: ${error || response.statusText}`
      );
    }
    return response.json() as Promise<ProjectTaskStatus[]>;
  });
}

export function getResource(
  projectId: string,
  resourceId: string
): Promise<ResourceDto> {
  return fetch(`/api/projects/${projectId}/resources/${resourceId}`, {
    method: "GET",
    headers: HEADERS,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error getting resource: ${response.statusText}`);
      }
      return response.json();
    })
    .then((result) => {
      return result as ResourceDto;
    });
}

export function getTask(projectId: string, taskId: string): Promise<TaskDto> {
  return fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
    method: "GET",
    headers: HEADERS,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error getting task: ${response.statusText}`);
      }

      return response.json();
    })
    .then((result) => {
      const task: TaskDto = {
        ...result,
        startDate: new Date(result.startDate),
        endDate: result.endDate ? new Date(result.endDate) : null,
      };

      return task;
    });
}

export function deleteProject(projectId: string): Promise<void> {
  return fetch(`/api/projects/${projectId}`, {
    method: "DELETE",
    headers: HEADERS,
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.json();

      throw new Error(
        `Error deleting project: ${error || response.statusText}`
      );
    }
  });
}

export function updateProject(
  projectId: string,
  project: ProjectDto
): Promise<void> {
  return fetch(`/api/projects/${projectId}`, {
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify(project),
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.json();

      throw new Error(
        `Error updating project: ${error || response.statusText}`
      );
    }
  });
}

export function updateResource(
  projectId: string,
  resource: ResourceDto
): Promise<void> {
  return fetch(`/api/projects/${projectId}/resources`, {
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify(resource),
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.json();

      throw new Error(
        `Error updating resource: ${error || response.statusText}`
      );
    }
  });
}

export function updateTask(projectId: string, task: TaskDto): Promise<void> {
  return fetch(`/api/projects/${projectId}/tasks`, {
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify(task),
  }).then(async (response) => {
    if (!response.ok) {
      console.log(response);
      const error = await response.json();

      throw new Error(`Error updating task: ${error || response.statusText}`);
    }
  });
}

export function createProject(project: ProjectDto): Promise<ProjectDto> {
  return fetch("/api/projects", {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(project),
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();

        throw new Error(
          `Error creating project: ${error || response.statusText}`
        );
      }

      return response.json();
    })
    .then((result) => {
      const project: ProjectDto = {
        ...result,
        startDate: new Date(result.startDate),
        endDate: result.endDate ? new Date(result.endDate) : null,
      };

      return project;
    });
}

export function createTask(projectId: string, task: TaskDto): Promise<TaskDto> {
  return fetch(`/api/projects/${projectId}/tasks`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(task),
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();

        throw new Error(`Error creating task: ${error || response.statusText}`);
      }

      return response.json();
    })
    .then((result) => {
      const task: TaskDto = {
        ...result,
        startDate: new Date(result.startDate),
        endDate: result.endDate ? new Date(result.endDate) : null,
      };

      return task;
    });
}

export function createResource(
  projectId: string,
  resource: ResourceDto
): Promise<ResourceDto> {
  return fetch(`/api/projects/${projectId}/resources`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(resource),
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();

        throw new Error(
          `Error creating resource: ${error || response.statusText}`
        );
      }

      return response.json();
    })
    .then((result) => {
      const resource: ResourceDto = {
        ...result,
      };

      return resource;
    });
}

export function deleteResource(
  projectId: string,
  resourceId: string
): Promise<void> {
  return fetch(`/api/projects/${projectId}/resources/${resourceId}`, {
    method: "DELETE",
    headers: HEADERS,
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.json();

      throw new Error(
        `Error deleting resource: ${error || response.statusText}`
      );
    }
  });
}

export function deleteTask(projectId: string, taskId: string): Promise<void> {
  return fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
    method: "DELETE",
    headers: HEADERS,
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.json();

      throw new Error(`Error deleting task: ${error || response.statusText}`);
    }
  });
}

export function validateProject(projectDto: ProjectDto): string[] {
  const errors: string[] = [];

  if (!projectDto.name || projectDto.name.trim() === "") {
    errors.push("Name is required.");
  }

  if (projectDto.name.length > NAME_MAX_LENGTH) {
    errors.push(`Name is longer than ${NAME_MAX_LENGTH} characters.`);
  }

  if (
    projectDto.description != null &&
    projectDto.description.length > DESCRPTION_MAX_LENGTH
  ) {
    errors.push(
      `Description is longer than ${DESCRPTION_MAX_LENGTH} characters.`
    );
  }

  if (!projectDto.templateId || projectDto.templateId.trim() === "") {
    errors.push("Template is required.");
  }

  if (projectDto.endDate && projectDto.endDate <= projectDto.startDate) {
    errors.push("End date must be after start date.");
  }

  return errors;
}

export function ValidateTask(taskDto: TaskDto): string[] {
  const errors: string[] = [];

  if (taskDto.endDate && taskDto.endDate <= taskDto.startDate) {
    errors.push("End date must be after start date.");
  }

  if (
    taskDto.description != null &&
    taskDto.description.length > DESCRPTION_MAX_LENGTH
  ) {
    errors.push(
      `Description is longer than ${DESCRPTION_MAX_LENGTH} characters.`
    );
  }

  if (!taskDto.name || taskDto.name.trim() === "") {
    errors.push("Name is required.");
  }

  if (taskDto.name.length > NAME_MAX_LENGTH) {
    errors.push(`Name is longer than ${NAME_MAX_LENGTH} characters.`);
  }

  if (!TaskStatus.includes(taskDto.status)) {
    errors.push("Invalid status selected.");
  }

  if (taskDto.endDate && taskDto.endDate <= taskDto.startDate) {
    errors.push("End date must be after start date.");
  }

  return errors;
}

export function ValidateResource(resourceDto: ResourceDto): string[] {
  const errors: string[] = [];

  if (!resourceDto.firstName || resourceDto.firstName.trim() === "") {
    errors.push("First name is required.");
  }

  if (resourceDto.firstName.length > NAME_MAX_LENGTH) {
    errors.push(`First name is longer than ${NAME_MAX_LENGTH} characters.`);
  }

  if (!resourceDto.lastName || resourceDto.lastName.trim() === "") {
    errors.push("Last name is required.");
  }

  if (resourceDto.lastName.length > NAME_MAX_LENGTH) {
    errors.push(`Last name is longer than ${NAME_MAX_LENGTH} characters.`);
  }

  if (!ResourceRoles.includes(resourceDto.role)) {
    errors.push("Invalid role selected.");
  }

  if (!resourceDto.team || resourceDto.team.trim() === "") {
    errors.push("Team is required.");
  }

  if (resourceDto.team && resourceDto.team.length > NAME_MAX_LENGTH) {
    errors.push(`Team name is longer than ${NAME_MAX_LENGTH} characters.`);
  }

  if (!resourceDto.userId) {
    errors.push("A user must be associated with the resource.");
  }

  return errors;
}
