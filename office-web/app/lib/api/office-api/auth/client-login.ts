import { OfficeAPI } from "..";

export type ClientLoginResponse = {
  access_token: string;
};

export async function login(
  email: string,
  password: string,
  office_id: string
): Promise<ClientLoginResponse> {
  const response = await OfficeAPI.post("/client-auth/login", {
    email,
    password,
    office_id,
  });

  return response.data;
}
