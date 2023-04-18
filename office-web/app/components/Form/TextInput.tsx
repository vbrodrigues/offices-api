import { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  type: string;
  register: any;
  error?: boolean;
  errorMessage?: string;
}

export function TextInput({
  name,
  label,
  type,
  register,
  error = false,
  ...rest
}: TextInputProps) {
  return (
    <input
      placeholder={label}
      className={`bg-gray-200 border border-gray-200 rounded-lg px-4 py-2 focus:outline-blue-500 ${
        error && "outline-red-500 focus:outline-red-500"
      }`}
      type={type}
      {...register(name)}
      {...rest}
    />
  );
}
