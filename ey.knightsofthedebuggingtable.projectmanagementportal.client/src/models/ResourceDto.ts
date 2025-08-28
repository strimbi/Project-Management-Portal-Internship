import type { TaskDto } from "./TaskDto";

export type ResourceDto = {
  id?: string;
  firstName: string;
  lastName: string;
  role: string;
  projectId: string;
  userId: string;
  team?: string;
  email: string;
  tasks?: TaskDto[];
};
