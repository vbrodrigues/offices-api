import axios from "axios";

export const OfficeAPI = axios.create({
  baseURL: "http://localhost:3000",
});
