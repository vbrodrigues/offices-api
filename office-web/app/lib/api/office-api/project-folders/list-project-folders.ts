// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";
import { ProjectFolder } from "./dtos";

// Every folder of the project, as a flat list (parent_id links them)
export async function listProjectFolders(
  access_token: string,
  project_id: string
): Promise<ProjectFolder[]> {
  try {
    const response = await OfficeAPI.get(`/project-folders/${project_id}`, {
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
