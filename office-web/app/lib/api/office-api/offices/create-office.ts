// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { isNetworkError, OfficeAPI } from "..";

export interface CreateOfficeRequest {
  name: string;
  owner_email: string;
  owner_password: string;
  owner_phone_number: string;
  logo?: string | null;
}

export interface CreateOfficeResponse {
  id: string;
  name: string;
  owner_email: string;
  owner_phone_number: string;
  created_at: Date;
}

export async function createOffice(
  data: CreateOfficeRequest
): Promise<CreateOfficeResponse> {
  try {
    const response = await OfficeAPI.post("/offices", data);

    if (response.status !== 201) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (err: AxiosError | any) {
    if (isNetworkError(err)) throw err;
    // Validation errors come as a list of messages
    const message = err.response?.data.message;
    throw new Error(Array.isArray(message) ? message.join(" ") : message);
  }
}
