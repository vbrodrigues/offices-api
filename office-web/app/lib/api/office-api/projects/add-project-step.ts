// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";
import { ProjectStep } from "./dtos";

// Adds an office step to the end of the project
export async function addProjectStep(
  project_id: string,
  step_id: string,
  access_token: string
): Promise<ProjectStep> {
  try {
    const response = await OfficeAPI.post(
      `/projects/${project_id}/steps/${step_id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (response.status !== 201) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (err: AxiosError | any) {
    throw new Error(err.response?.data.message);
  }
}
