// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";

export async function removeProjectStep(
  project_id: string,
  step_id: string,
  access_token: string
): Promise<void> {
  try {
    const response = await OfficeAPI.delete(
      `/projects/${project_id}/steps/${step_id}`,
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
