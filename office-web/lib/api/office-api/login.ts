import { OfficeAPI } from ".";

export interface LoginRequest {
  email: string;
  password: string;
  office_id: string;
}

export interface LoginResponse {
  access_token: string;
}

export async function login({
  email,
  password,
  office_id,
}: LoginRequest): Promise<LoginResponse | null> {
  try {
    const response = await OfficeAPI.post("/auth/login", {
      email,
      password,
      office_id,
    });

    if (response.status !== 201) {
      console.log(response.data);
      return null;
    }

    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}
