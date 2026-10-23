// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";
import { ProjectFile } from "../projects/dtos";

export interface CreateProjectFileRequest {
  project_id: string;
  category_id?: string | null;
  // ProjectStep of this project the file belongs to
  project_step_id?: string | null;
  name: string;
  // Data URL of the file (FileReader.readAsDataURL)
  file: string;
  // Extension of the file, e.g. "pdf"
  fileFormat: string;
}

export async function createProjectFile(
  data: CreateProjectFileRequest,
  access_token: string,
  // eslint-disable-next-line no-unused-vars
  onProgress?: (percentage: number) => void
): Promise<ProjectFile> {
  try {
    const response = await OfficeAPI.post("/project-files", data, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
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
