import type { ApprovalDto } from "./ApprovalDto";
import type { ProjectDto } from "./ProjectDto";

export type AdvanceRequestDto = {
  id?: string;
  projectId: string;
  requestedById?: string;
  currentStageId: string;
  nextStageId?: string;
  requestedAt: Date;
  status: string;
  project: ProjectDto;
  approvals?: ApprovalDto[];
};
