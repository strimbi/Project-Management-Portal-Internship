import type { ApprovalDto } from "../models/ApprovalDto";
import { HEADERS } from "../util/constants";

export function getApprovals(): Promise<ApprovalDto[]> {
  return fetch(`/api/approvals`, {
    method: "GET",
    headers: HEADERS,
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();

        throw new Error(
          `Error getting approvals: ${error || response.statusText}`
        );
      }

      if (response.status === 204) {
        return [];
      }

      return response.json();
    })
    .then((result) => {
      return result.map((request: any) => ({
        ...request,
        approvedAt: request.approvedAt ? new Date(request.approvedAt) : null,
      })) as ApprovalDto[];
    });
}

export async function approveAdvanceRequest(
  advanceRequestId: string
): Promise<string> {
  return fetch(`/api/approvals/approve/${advanceRequestId}`, {
    method: "POST",
    headers: HEADERS,
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();

        throw new Error(
          `Error approving approval: ${error || response.statusText}`
        );
      }

      return response.json();
    })
    .then((result) => {
      return result;
    });
}

export async function rejectAdvanceRequest(
  advanceRequestId: string
): Promise<string> {
  return fetch(`/api/approvals/reject/${advanceRequestId}`, {
    method: "POST",
    headers: HEADERS,
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.json();

      throw new Error(
        `Error rejecting approval: ${error || response.statusText}`
      );
    }

    return response.json();
  });
}
