// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";

export interface UpdateClientRequest {
  name?: string;
  email?: string;
  phone_number?: string | null;
}

export async function updateClient(
  client_id: string,
  data: UpdateClientRequest,
  access_token: string
): Promise<void> {
  try {
    const response = await OfficeAPI.put(`/clients/${client_id}`, data, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
  } catch (err: AxiosError | any) {
    throw new Error(err.response?.data.message);
  }
}
