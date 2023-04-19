// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";
import { Category } from "./dtos";

export async function deleteCategory(
  project_type_id: string,
  access_token: string
): Promise<Category> {
  try {
    const response = await OfficeAPI.delete(`/categories/${project_type_id}`, {
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
