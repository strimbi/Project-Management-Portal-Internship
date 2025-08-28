import type { StakeholderDto } from "../models/StakeholderDto";
import { HEADERS } from "../util/constants";

export function getStakeholder(
  projectId: string,
  stakeholderId: string
): Promise<StakeholderDto> {
  return fetch(`/api/projects/${projectId}/stakeholders/${stakeholderId}`, {
    method: "GET",
    headers: HEADERS,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error getting stakeholder: ${response.statusText}`);
      }
      return response.json();
    })
    .then((result) => {
      return result as StakeholderDto;
    });
}

export function createStakeholder(
  projectId: string,
  stakeholder: StakeholderDto
): Promise<StakeholderDto> {
  return fetch(`/api/projects/${projectId}/stakeholders`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(stakeholder),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error creating stakeholder: ${response.statusText}`);
      }

      return response.json();
    })
    .then((result) => {
      const resource: StakeholderDto = {
        ...result,
      };

      return resource;
    });
}

export function updateStakeholder(
  projectId: string,
  stakeholder: StakeholderDto
): Promise<void> {
  return fetch(`/api/projects/${projectId}/stakeholders`, {
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify(stakeholder),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Error updating stakeholder: ${response.statusText}`);
    }
  });
}

export function deleteStakeholder(
  projectId: string,
  stakeholderId: string
): Promise<void> {
  return fetch(`/api/projects/${projectId}/stakeholders/${stakeholderId}`, {
    method: "DELETE",
    headers: HEADERS,
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.json();

      throw new Error(
        `Error deleting stakeholder: ${error || response.statusText}`
      );
    }
  });
}
