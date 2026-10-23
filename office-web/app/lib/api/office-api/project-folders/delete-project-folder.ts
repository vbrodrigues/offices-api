// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";

// Deletes the folder with every subfolder and file inside it
export async function deleteProjectFolder(
  project_folder_id: string,
  access_token: string
): Promise<void> {
  try {
    const response = await OfficeAPI.delete(
      `/project-folders/${project_folder_id}`,
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
