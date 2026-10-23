import { Buffer } from 'buffer';

export const convertBase64 = (file: File | null) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// Accepts plain base64 or a data URL ("data:<type>;base64,<data>"), which is
// what the browser's FileReader produces. The prefix must be dropped or it
// gets decoded as part of the file.
export const decodeBase64 = (url: string) => {
  const data = url.startsWith('data:') ? url.slice(url.indexOf(',') + 1) : url;
  const decoded = Buffer.from(data, 'base64');
  // return URL.createObjectURL(
  //   new Blob([
  //     new Uint8Array(decoded.buffer, decoded.byteOffset, decoded.byteLength),
  //   ])
  // );
  return decoded;
};
