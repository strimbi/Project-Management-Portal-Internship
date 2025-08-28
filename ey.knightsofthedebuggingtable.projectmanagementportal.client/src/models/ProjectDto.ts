import type { StageDto } from "./StageDto";
import type { ResourceDto } from "./ResourceDto";
import type { StakeholderDto } from "./StakeholderDto";
import type { TaskDto } from "./TaskDto";

export type ProjectDto = {
  id?: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  createdBy?: string;
  templateId: string;
  ownerId: string;

  currentStage?: StageDto;
  stakeholders?: StakeholderDto[];
  tasks?: TaskDto[];
  resources?: ResourceDto[];
};
