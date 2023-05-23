// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";

export interface CreateProjectRequest {
  client_id: string;
  name: string;
  steps?: string[] | null;
}

export interface CreateProjectResponse {
  id: string;
  client_id: string;
  name: string;
  updated_at?: Date | null;
  created_at: Date;
}

export async function createProject(
  data: CreateProjectRequest,
  access_token: string
): Promise<CreateProjectResponse> {
  try {
    const response = await OfficeAPI.post("/projects", data, {
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
