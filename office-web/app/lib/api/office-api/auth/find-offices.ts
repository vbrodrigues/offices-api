import { OfficeAPI } from "..";

export interface FindOfficesRequest {
  email: string;
  password: string;
}

export interface EmployeeOffice {
  id: string;
  name: string;
}

// Offices where these credentials are valid. Empty when they are invalid.
export async function findOffices({
  email,
  password,
}: FindOfficesRequest): Promise<EmployeeOffice[]> {
  try {
    const response = await OfficeAPI.post("/auth/offices", {
      email,
      password,
    });

    if (response.status !== 200) {
      return [];
    }

    return response.data;
  } catch (err) {
    console.log(err);
    return [];
  }
}
