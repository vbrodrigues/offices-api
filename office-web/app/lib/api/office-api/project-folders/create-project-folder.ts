// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";
import { ProjectFolder } from "./dtos";

export interface CreateProjectFolderRequest {
  project_id: string;
  // null = root of the project
  parent_id: string | null;
  name: string;
  category_id?: string | null;
  project_step_id?: string | null;
}

export async function createProjectFolder(
  data: CreateProjectFolderRequest,
  access_token: string
): Promise<ProjectFolder> {
  try {
    const response = await OfficeAPI.post("/project-folders", data, {
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
