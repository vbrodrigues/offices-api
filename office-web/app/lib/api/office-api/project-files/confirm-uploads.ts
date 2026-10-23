// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";
import { ProjectFile } from "../projects/dtos";
import { UploadFileInfo } from "./request-uploads";

export interface UploadedFile extends UploadFileInfo {
  key: string;
}

// Batch upload, step 2: saves the files already PUT to storage. Folders in
// relative_path are created under folder_id; duplicate names get " (1)".
export async function confirmProjectFileUploads(
  project_id: string,
  folder_id: string | null,
  files: UploadedFile[],
  access_token: string
): Promise<ProjectFile[]> {
  try {
    const response = await OfficeAPI.post(
      "/project-files/batch",
      { project_id, folder_id, files },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (response.status !== 201) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (err: AxiosError | any) {
    throw new Error(err.response?.data.message);
  }
}
