export type ApprovalDto = {
  id?: string;
  stakeholderId: string;
  advanceRequestId: string;
  status: string;
  approvedAt?: Date;
  projectName?: string;
  currentStageName?: string;
  nextStageName?: string;
};
