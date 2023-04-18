import { Buffer } from "buffer";

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const convertBase64 = (
  file: File | null
): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const decodeBase64 = (url: string) => {
  const decoded = Buffer.from(url, "base64");
  // return URL.createObjectURL(
  //   new Blob([
  //     new Uint8Array(decoded.buffer, decoded.byteOffset, decoded.byteLength),
  //   ])
  // );
  return decoded;
};

export const getInitials = (name: string) => {
  const names = name.split(" ");
  const initials = names.map((n) => n[0]);
  return initials.join("");
};
