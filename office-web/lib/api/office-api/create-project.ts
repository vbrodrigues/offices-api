// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from ".";

export interface CreateProjectRequest {
  client_id: string;
  project_type_id: string;
  name: string;
  schedule?: {
    assigned_employee_id: string;
    start_date: Date;
    end_date: Date;
  } | null;
}

export interface CreateProjectResponse {
  id: string;
  client_id: string;
  project_type_id: string;
  name: string;
  status: string;
  updated_at?: Date | null;
  created_at: Date;
}

export async function createProject(
  data: CreateProjectRequest
): Promise<CreateProjectResponse> {
  try {
    const response = await OfficeAPI.post("/projects", data);

    if (response.status !== 201) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (err: AxiosError | any) {
    throw new Error(err.response?.data.message);
  }
}
