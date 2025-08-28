import type { StageDto } from "./StageDto";

export type TemplateDto = {
  id?: string;
  name: string;
  description?: string;
  createdBy?: string;
  stages?: StageDto[];
};
