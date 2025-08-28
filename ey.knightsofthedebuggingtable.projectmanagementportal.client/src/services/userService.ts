import type { UserDto } from "../models/UserDto";
import { HEADERS } from "../util/constants";

export function getUsers(): Promise<UserDto[]> {
  return fetch("/api/users", {
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
      return result.map((user: any) => ({
        ...user,
      })) as UserDto[];
    });
}

export function getUser(id: string): Promise<UserDto> {
  return fetch(`/api/users/${id}`, {
    method: "GET",
    headers: HEADERS,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching users: ${response.statusText}`);
      }

      return response.json();
    })
    .then((result) => {
      return result as UserDto;
    });
}

export function getLoggedInUserId(): Promise<string> {
  return fetch("/api/users/me", {
    method: "GET",
    headers: HEADERS,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching users: ${response.statusText}`);
      }

      return response.json();
    })
    .then((result) => {
      return result;
    });
}

export function getUsersNotAssignedAsResources(
  projectId: string
): Promise<UserDto[]> {
  return fetch(`/api/users/filtered/${projectId}`, {
    method: "GET",
    headers: HEADERS,
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `Error getting filtered users: ${error || response.statusText}`
        );
      }

      return response.json();
    })
    .then((result) => {
      return result as UserDto[];
    });
}

export function getUsersNotAssignedAsStakeholders(
  projectId: string
): Promise<UserDto[]> {
  return fetch(`/api/users/filtered-stakeholders/${projectId}`, {
    method: "GET",
    headers: HEADERS,
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `Error getting filtered users: ${error || response.statusText}`
        );
      }

      return response.json();
    })
    .then((result) => {
      return result as UserDto[];
    });
}
