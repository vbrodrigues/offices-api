import axios from "axios";

export const OfficeAPI = axios.create({
  // Set NEXT_PUBLIC_API_URL to reach the API from another host (e.g. a phone)
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
});
