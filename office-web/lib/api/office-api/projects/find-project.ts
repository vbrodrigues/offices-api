// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";
import { Project } from "./dtos";

export async function findProject(
  access_token: string,
  project_id: string
): Promise<Project> {
  try {
    const response = await OfficeAPI.get(`/projects/${project_id}`, {
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
