// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";

// Moves files into a folder (null = root); names taken there get " (1)"
export async function moveProjectFiles(
  file_ids: string[],
  folder_id: string | null,
  access_token: string
): Promise<void> {
  try {
    const response = await OfficeAPI.put(
      "/project-files/move",
      { file_ids, folder_id },
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
