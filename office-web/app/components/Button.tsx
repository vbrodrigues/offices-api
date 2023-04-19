import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  onClick?: () => void;
  size?: "small" | "medium" | "full";
  fill?: boolean;
}

const Button = ({
  text,
  onClick,
  size = "medium",
  fill = true,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={`
        rounded-lg  font-title hover:opacity-90 transition-opacity
        ${
          fill
            ? "bg-blue-500 text-gray-100"
            : "bg-transparent border border-blue-500 text-blue-500"
        }
        ${
          size === "small"
            ? "px-4 w-32 py-2"
            : size === "medium"
            ? "px-6 w-52 py-3 "
            : "w-full py-3 "
        }
      `}
      onClick={onClick}
      {...rest}
    >
      {text}
    </button>
  );
};

export default Button;
