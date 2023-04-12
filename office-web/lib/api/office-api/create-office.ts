import { OfficeAPI } from ".";

export interface CreateOfficeRequest {
  name: string;
  owner_email: string;
  owner_password: string;
  owner_phone_number: string;
  logo: string;
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
  const response = await OfficeAPI.post("/offices", data);
  return response.data;
}
