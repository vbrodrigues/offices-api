import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface DropzoneProps {
  label?: string;
  setFile: (file: File) => void;
  description?: string;
  height?: string;
}

export function Dropzone({
  label,
  description,
  setFile,
  height,
}: DropzoneProps) {
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxFiles: 1,
    maxSize: 10000000,
    onDrop: useCallback(
      (acceptedFiles: File[]) => {
        setFile(acceptedFiles[0]);
      },
      [setFile]
    ),
  });

  return (
    <div className="flex flex-col gap-1 max-w-lg">
      {label && <p className="font-title text-gray-500">{label}</p>}
      <div
        className={`dropzone border-2 border-dashed border-gray-400 text-gray-400 p-4 rounded-lg hover:cursor-pointer hover:border-blue-500 hover:text-blue-500 flex items-center justify-center text-center ${
          height && `h-${height}`
        }`}
        {...getRootProps()}
      >
        {acceptedFiles.length > 0 ? (
          <p>{acceptedFiles[0].name}</p>
        ) : (
          <p className="font-title">{description}</p>
        )}
        <input type="text" {...getInputProps()} />
      </div>
    </div>
  );
}
