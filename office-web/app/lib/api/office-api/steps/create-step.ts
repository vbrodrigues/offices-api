// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";
import { Step } from "./dtos";

export interface CreateStepRequest {
  name: string;
  office_id: string;
}

export async function createStep(
  data: CreateStepRequest,
  access_token: string
): Promise<Step> {
  try {
    const response = await OfficeAPI.post("/steps", data, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (response.status !== 201) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (err: AxiosError | any) {
    throw new Error(err.response?.data.message);
  }
}
