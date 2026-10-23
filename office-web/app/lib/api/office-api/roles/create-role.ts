// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";
import { Role } from "../../roles/dtos";

export interface CreateRoleRequest {
  label: string;
}

export async function createRole(
  data: CreateRoleRequest,
  access_token: string
): Promise<Role> {
  try {
    const response = await OfficeAPI.post("/roles", data, {
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
