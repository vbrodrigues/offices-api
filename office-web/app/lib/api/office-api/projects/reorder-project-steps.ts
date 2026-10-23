// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";

// step_ids: every step of the project, in the new order
export async function reorderProjectSteps(
  project_id: string,
  step_ids: string[],
  access_token: string
): Promise<void> {
  try {
    const response = await OfficeAPI.put(
      `/projects/${project_id}/steps`,
      { step_ids },
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
