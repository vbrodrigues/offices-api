// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";

// The API inactivates the client (is_active = false); its projects are kept.
export async function deleteClient(
  client_id: string,
  access_token: string
): Promise<void> {
  try {
    const response = await OfficeAPI.delete(`/clients/${client_id}`, {
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
