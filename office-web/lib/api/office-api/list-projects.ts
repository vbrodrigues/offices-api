// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from ".";

export interface Project {
  id: string;
  client_id: string;
  project_type_id: string;
  name: string;
  status: string;
  updated_at: Date;
  created_at: Date;
  client: any;
  files: any[];
}

export async function listProjects(access_token: string): Promise<Project[]> {
  try {
    const response = await OfficeAPI.get("/projects", {
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
