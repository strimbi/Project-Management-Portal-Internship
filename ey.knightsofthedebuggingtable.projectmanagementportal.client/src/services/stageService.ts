import type { StageDto } from "../models/StageDto";
import { HEADERS } from "../util/constants";

export function getStages(): Promise<StageDto[]> {
  return fetch("/api/stages", {
    method: "GET",
    headers: HEADERS,
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();

        throw new Error(
          `Error getting stages: ${error || response.statusText}`
        );
      }

      return response.json();
    })
    .then((result) => {
      return result as StageDto[];
    });
}
