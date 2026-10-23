// PUTs a file straight to a presigned storage URL. Uses XHR instead of fetch
// because fetch can't report upload progress.
export function uploadToStorage(
  url: string,
  file: File,
  content_type: string,
  // eslint-disable-next-line no-unused-vars
  onProgress: (percentage: number) => void,
  signal: AbortSignal
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("PUT", url);
    // Must match the type the URL was signed with, or storage refuses it
    xhr.setRequestHeader("Content-Type", content_type);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`Upload failed with status ${xhr.status}`));
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.onabort = () => reject(new DOMException("Canceled", "AbortError"));

    if (signal.aborted) {
      reject(new DOMException("Canceled", "AbortError"));
      return;
    }
    signal.addEventListener("abort", () => xhr.abort());

    xhr.send(file);
  });
}

// Folders between the upload target and the file, from a folder drop
// (react-dropzone sets `path`) or a folder picker (webkitRelativePath):
// "Levantamento/Fotos/a.jpg" -> "Levantamento/Fotos"; "" for a loose file.
export function relativeFolderOf(file: File): string {
  const fullPath =
    file.webkitRelativePath || (file as File & { path?: string }).path || "";
  const segments = fullPath
    .replace(/^\.?\/+/, "")
    .split("/")
    .filter(Boolean);

  return segments.slice(0, -1).join("/");
}
