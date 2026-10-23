// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";

// Fields left out stay as they are; null removes the link
export interface UpdateProjectFileRequest {
  category_id?: string | null;
  project_step_id?: string | null;
}

export async function updateProjectFile(
  project_file_id: string,
  data: UpdateProjectFileRequest,
  access_token: string
): Promise<void> {
  try {
    const response = await OfficeAPI.put(
      `/project-files/${project_file_id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
  } catch (err: AxiosError | any) {
    throw new Error(err.response?.data.message);
  }
}
