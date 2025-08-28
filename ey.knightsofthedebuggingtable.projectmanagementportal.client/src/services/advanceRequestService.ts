import type { AdvanceRequestDto } from "../models/AdvanceRequestDto";
import { HEADERS } from "../util/constants";

export function advanceRequestExists(projectId: string): Promise<boolean> {
  return fetch(`/api/advance-requests/exists/${projectId}`, {
    method: "GET",
    headers: HEADERS,
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();

        throw new Error(
          `Error getting advanced-requests: ${error || response.statusText}`
        );
      }

      return response.json();
    })
    .then((result) => {
      return result as boolean;
    });
}

export function getAdvanceRequests(): Promise<AdvanceRequestDto[]> {
  return fetch(`/api/advance-requests`, {
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
      return result.map((request: any) => ({
        ...request,
        requestedAt: new Date(request.requestedAt),
      })) as AdvanceRequestDto[];
    });
}

export function createAdvanceRequest(
  advanceRequest: AdvanceRequestDto
): Promise<AdvanceRequestDto> {
  return fetch("/api/advance-requests", {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(advanceRequest),
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();

        throw new Error(
          `Error creating advance request: ${error || response.statusText}`
        );
      }

      return response.json();
    })
    .then((result) => {
      const advanceRequest: AdvanceRequestDto = {
        ...result,
        requestedAt: new Date(result.requestedAt),
      };

      return advanceRequest;
    });
}
