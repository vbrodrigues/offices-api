import axios, { AxiosError } from "axios";

const API_PORT = 3000;

// NEXT_PUBLIC_API_URL when set. Otherwise the API is assumed to run on the
// same host the page was opened from: localhost on the PC, the PC's IP when
// a phone opens the portal over the network (on the phone, "localhost" would
// be the phone itself).
function apiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window === "undefined") return `http://localhost:${API_PORT}`;
  return `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;
}

export const OfficeAPI = axios.create({
  baseURL: apiBaseUrl(),
});

// True when the request never got an answer (API down or unreachable), as
// opposed to the API answering with an error
export function isNetworkError(err: unknown) {
  return (err as AxiosError)?.isAxiosError && !(err as AxiosError).response;
}
