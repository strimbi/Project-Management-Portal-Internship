import type { TemplateDto } from "../models/TemplateDto";
import {
  DESCRPTION_MAX_LENGTH,
  HEADERS,
  NAME_MAX_LENGTH,
} from "../util/constants";

export function getTemplates(): Promise<TemplateDto[]> {
  return fetch("/api/templates", {
    method: "GET",
    headers: HEADERS,
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();

        throw new Error(
          `Error getting templates: ${error || response.statusText}`
        );
      }

      return response.json();
    })
    .then((result) => {
      return result as TemplateDto[];
    });
}

export function getTemplate(id: string): Promise<TemplateDto> {
  return fetch(`/api/templates/${id}`, {
    method: "GET",
    headers: HEADERS,
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();

        throw new Error(
          `Error getting templates: ${error || response.statusText}`
        );
      }

      return response.json();
    })
    .then((result) => {
      return result as TemplateDto;
    });
}

export function createTemplate(template: TemplateDto): Promise<TemplateDto> {
  return fetch("/api/templates", {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(template),
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();

        throw new Error(
          `Error creating template: ${error || response.statusText}`
        );
      }

      return response.json();
    })
    .then((result) => {
      return result;
    });
}

export function validateTemplate(templateDto: TemplateDto): string[] {
  const errors: string[] = [];

  if (!templateDto.name || templateDto.name.trim() === "") {
    errors.push("Name is required.");
  }

  if (templateDto.name.length > NAME_MAX_LENGTH) {
    errors.push(`Name is longer than ${NAME_MAX_LENGTH} characters.`);
  }

  if (
    templateDto.description != null &&
    templateDto.description.length > DESCRPTION_MAX_LENGTH
  ) {
    errors.push(
      `Description is longer than ${DESCRPTION_MAX_LENGTH} characters.`
    );
  }

  if (!templateDto.stages || templateDto.stages.length == 0) {
    errors.push("At least one stage is required");
  }

  return errors;
}
