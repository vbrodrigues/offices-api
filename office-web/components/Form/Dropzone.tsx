import { useDropzone } from "react-dropzone";

interface DropzoneProps {
  label: string;
  description?: string;
}

export function Dropzone({ label, description }: DropzoneProps) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxFiles: 1,
    maxSize: 10000000,
  });

  return (
    <div className="flex flex-col gap-1 max-w-md">
      <p className="font-title  text-gray-500">{label}</p>
      <div
        className="dropzone border-2 border-dashed border-gray-400 text-gray-400 p-4 rounded-lg hover:cursor-pointer hover:border-blue-500 hover:text-blue-500 flex items-center justify-center text-center"
        {...getRootProps()}
      >
        <p className="font-title">{description}</p>
        <input type="text" {...getInputProps()} />
      </div>
    </div>
  );
}
