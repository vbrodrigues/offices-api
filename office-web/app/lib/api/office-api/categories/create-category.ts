// eslint-disable-next-line no-unused-vars
import { AxiosError } from "axios";
import { OfficeAPI } from "..";
import { Category } from "./dtos";

export interface CreateCategoryRequest {
  name: string;
  office_id: string;
}

export async function createCategory(
  data: CreateCategoryRequest,
  access_token: string
): Promise<Category> {
  try {
    const response = await OfficeAPI.post("/categories", data, {
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
