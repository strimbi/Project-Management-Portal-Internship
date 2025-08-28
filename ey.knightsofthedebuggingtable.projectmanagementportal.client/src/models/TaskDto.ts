export type TaskDto = {
  id?: string;
  name: string;
  description: string;
  projectId: string;
  resourceId: string | null;
  status: string;
  startDate: Date;
  endDate: Date | null;
  resourceName?: string;
};
