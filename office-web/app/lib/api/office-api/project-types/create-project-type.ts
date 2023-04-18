// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";
import { ProjectType } from "./dtos";

export interface CreateProjectTypeRequest {
  name: string;
  office_id: string;
}

export async function createProjectType(
  data: CreateProjectTypeRequest,
  access_token: string
): Promise<ProjectType> {
  try {
    const response = await OfficeAPI.post("/project-types", data, {
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
