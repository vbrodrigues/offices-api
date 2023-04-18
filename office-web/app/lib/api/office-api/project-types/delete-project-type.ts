// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";
import { ProjectType } from "./dtos";

export async function deleteProjectType(
  project_type_id: string,
  access_token: string
): Promise<ProjectType> {
  try {
    const response = await OfficeAPI.delete(
      `/project-types/${project_type_id}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (err: AxiosError | any) {
    throw new Error(err.response?.data.message);
  }
}
