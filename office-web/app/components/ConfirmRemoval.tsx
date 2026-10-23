"use client";

import { useState } from "react";
import Button from "./Button";

interface ConfirmRemovalProps {
  message: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

// Content for a Modal that asks before removing something
export function ConfirmRemoval({
  message,
  onConfirm,
  onCancel,
}: ConfirmRemovalProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleConfirm = async () => {
    setIsRemoving(true);
    await onConfirm();
    setIsRemoving(false);
  };

  return (
    <div className="flex flex-col gap-8 w-full mt-10">
      <p className="text-gray-700">{message}</p>
      <div className="flex gap-4 justify-end">
        <Button text="CANCELAR" size="small" fill={false} onClick={onCancel} />
        <button
          type="button"
          disabled={isRemoving}
          onClick={handleConfirm}
          className="rounded-lg font-title hover:opacity-90 transition-opacity px-4 w-32 py-2 bg-red-400 text-gray-100 disabled:opacity-50"
        >
          REMOVER
        </button>
      </div>
    </div>
  );
}
