// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";
import { Client } from "./dtos";

export interface CreateClientRequest {
  office_id: string;
  name: string;
  email: string;
  password: string;
  phone_number?: string | null;
}

export async function createClient(
  data: CreateClientRequest,
  access_token: string
): Promise<Client> {
  try {
    const response = await OfficeAPI.post("/clients", data, {
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
