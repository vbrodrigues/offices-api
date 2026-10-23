// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";

// The API takes at most this many files per request
export const MAX_FILES_PER_BATCH = 100;
// A single S3 PUT can't be bigger than 5GB
export const MAX_FILE_BYTES = 5 * 1024 * 1024 * 1024;

export interface UploadFileInfo {
  name: string;
  size: number;
  // File.type; empty when the browser doesn't know it
  content_type?: string;
  // Folders between the target folder and the file, e.g. "Fotos/Térreo"
  relative_path?: string;
}

export interface ProjectFileUpload {
  name: string;
  relative_path: string | null;
  // Storage key, sent back when confirming the batch
  key: string;
  // Presigned URL to PUT the file to, valid for 15 minutes
  url: string;
  // Must be sent as the Content-Type header of the PUT
  content_type: string;
}

// Batch upload, step 1: one presigned URL per file, in the same order
export async function requestProjectFileUploads(
  project_id: string,
  files: UploadFileInfo[],
  access_token: string
): Promise<ProjectFileUpload[]> {
  try {
    const response = await OfficeAPI.post(
      "/project-files/uploads",
      { project_id, files },
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
