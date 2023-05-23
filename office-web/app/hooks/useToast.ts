import { useState } from "react";

export function useToast() {
  const [toastText, setToastText] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<"info" | "success" | "error">(
    "info"
  );
  const [toastTitle, setToastTitle] = useState("Oops!");

  const showToast = (
    title: string,
    text: string,
    type: "info" | "success" | "error"
  ) => {
    setToastText(text);
    setToastOpen(true);
    setToastType(type);
    setToastTitle(title);
  };

  return {
    showToast,
    setToastOpen,
    toastText,
    toastOpen,
    toastType,
    toastTitle,
  };
}
