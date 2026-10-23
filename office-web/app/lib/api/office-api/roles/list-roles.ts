// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";
import { Role } from "../../roles/dtos";

export async function listRoles(access_token: string): Promise<Role[]> {
  try {
    const response = await OfficeAPI.get("/roles", {
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
