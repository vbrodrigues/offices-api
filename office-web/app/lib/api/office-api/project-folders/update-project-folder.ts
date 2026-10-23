// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";

// Fields left out stay as they are; null clears a tag or moves to the root
export interface UpdateProjectFolderRequest {
  name?: string;
  parent_id?: string | null;
  position?: number;
  category_id?: string | null;
  project_step_id?: string | null;
}

export async function updateProjectFolder(
  project_folder_id: string,
  data: UpdateProjectFolderRequest,
  access_token: string
): Promise<void> {
  try {
    const response = await OfficeAPI.put(
      `/project-folders/${project_folder_id}`,
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
