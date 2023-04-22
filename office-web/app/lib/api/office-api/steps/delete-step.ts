// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";
import { Step } from "./dtos";

export async function deleteStep(
  step_id: string,
  access_token: string
): Promise<Step> {
  try {
    const response = await OfficeAPI.delete(`/steps/${step_id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (err: AxiosError | any) {
    throw new Error(err.response?.data.message);
  }
}
