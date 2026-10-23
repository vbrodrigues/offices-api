// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";
import { ProjectStep } from "./dtos";

export interface UpdateProjectStepRequest {
  status?: ProjectStep["status"];
  // Employee responsible for the step; null removes the responsible
  assigned_to?: string | null;
}

export async function updateProjectStep(
  project_id: string,
  step_id: string,
  data: UpdateProjectStepRequest,
  access_token: string
): Promise<void> {
  try {
    const response = await OfficeAPI.put(
      `/projects/${project_id}/steps/${step_id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
  } catch (err: AxiosError | any) {
    throw new Error(err.response?.data.message);
  }
}
