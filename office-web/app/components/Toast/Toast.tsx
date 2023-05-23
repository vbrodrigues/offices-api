"use client";

import * as Toast from "@radix-ui/react-toast";
import "./style.css";

export interface ToastProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  text: string;
}

export interface CornerToastProps {
  type: "info" | "success" | "error";
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  text: string;
}

const CornerToast = ({
  type,
  open,
  setOpen,
  title,
  text,
}: CornerToastProps) => {
  return (
    <>
      <Toast.Root
        className={`ToastRoot shadow-md py-2 px-4 rounded-lg ${
          type === "info"
            ? "bg-gray-100"
            : type === "success"
            ? "bg-green-200"
            : "bg-red-100"
        }`}
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title
          className={`font-bold ${
            type === "info"
              ? "text-gray-400"
              : type === "success"
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {title}
        </Toast.Title>
        <Toast.Description asChild>
          <p
            className={`${
              type === "info"
                ? "text-gray-800"
                : type === "success"
                ? "text-green-800"
                : "text-red-800"
            }`}
          >
            {text}
          </p>
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport className="ToastViewport fixed top-0 right-0 m-4 transition-all" />
    </>
  );
};

const ErrorToast = ({ open, setOpen, title, text }: ToastProps) => {
  return (
    <>
      <Toast.Root
        className="ToastRoot shadow-md py-2 px-4 rounded-lg bg-red-100"
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className="font-bold text-red-400">{title}</Toast.Title>
        <Toast.Description asChild>
          <p className="text-red-800">{text}</p>
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport className="ToastViewport fixed top-0 right-0 m-4 transition-all" />
    </>
  );
};

const SuccessToast = ({ open, setOpen, title, text }: ToastProps) => {
  return (
    <>
      <Toast.Root
        className="ToastRoot shadow-md py-2 px-4 rounded-lg bg-green-100"
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className="font-bold text-green-400">{title}</Toast.Title>
        <Toast.Description asChild>
          <p className="text-green-800">{text}</p>
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport className="ToastViewport fixed top-0 right-0 m-4 transition-all" />
    </>
  );
};

const InfoToast = ({ open, setOpen, title, text }: ToastProps) => {
  return (
    <>
      <Toast.Root
        className="ToastRoot shadow-md py-2 px-4 rounded-lg bg-gray-100"
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className="font-bold text-gray-400">{title}</Toast.Title>
        <Toast.Description asChild>
          <p className="text-gray-800">{text}</p>
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport className="ToastViewport fixed top-0 right-0 m-4 transition-all" />
    </>
  );
};

export { ErrorToast, SuccessToast, InfoToast, CornerToast };
