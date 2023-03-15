import { Buffer } from 'buffer';

export const convertBase64 = (file: File | null) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const decodeBase64 = (url: string) => {
  const decoded = Buffer.from(url, 'base64');
  // return URL.createObjectURL(
  //   new Blob([
  //     new Uint8Array(decoded.buffer, decoded.byteOffset, decoded.byteLength),
  //   ])
  // );
  return decoded;
};
