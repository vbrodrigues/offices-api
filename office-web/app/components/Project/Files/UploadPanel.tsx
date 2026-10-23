"use client";

import { useState } from "react";
import {
  MdCheckCircle,
  MdClose,
  MdErrorOutline,
  MdExpandLess,
  MdExpandMore,
} from "react-icons/md";
import { QueuedUpload } from "@/app/hooks/useUploadQueue";
import { formatBytes } from "./folder-tree";

interface UploadPanelProps {
  items: QueuedUpload[];
  isBusy: boolean;
  onRetry: () => void;
  onCancel: () => void;
  onClose: () => void;
}

const statusLabel: Record<QueuedUpload["status"], string> = {
  waiting: "Na fila",
  uploading: "Enviando",
  saving: "Salvando",
  done: "Enviado",
  error: "Erro",
  canceled: "Cancelado",
};

// Floating list of uploads with their progress, like Drive's. Full width at
// the bottom of the screen on phones, a corner card from md up.
export default function UploadPanel({
  items,
  isBusy,
  onRetry,
  onCancel,
  onClose,
}: UploadPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (items.length === 0) return null;

  const done = items.filter((item) => item.status === "done").length;
  const failed = items.filter((item) => item.status === "error").length;

  const title = isBusy
    ? `Enviando ${done} de ${items.length}`
    : failed > 0
    ? `${done} enviado(s), ${failed} com erro`
    : `${done} arquivo(s) enviado(s)`;

  return (
    <div className="fixed z-30 inset-x-0 bottom-0 md:inset-x-auto md:right-6 md:bottom-6 md:w-96 bg-white shadow-2xl rounded-t-2xl md:rounded-xl border border-gray-200 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
        <p className="font-semibold flex-1 truncate">{title}</p>
        {failed > 0 && !isBusy && (
          <button
            type="button"
            onClick={onRetry}
            className="text-sm text-blue-500 px-2 py-1"
          >
            Tentar de novo
          </button>
        )}
        {isBusy && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-red-400 px-2 py-1"
          >
            Cancelar
          </button>
        )}
        <button
          type="button"
          aria-label={isCollapsed ? "Mostrar envios" : "Esconder envios"}
          onClick={() => setIsCollapsed((collapsed) => !collapsed)}
          className="p-1 text-gray-500"
        >
          {isCollapsed ? (
            <MdExpandLess size={24} />
          ) : (
            <MdExpandMore size={24} />
          )}
        </button>
        {!isBusy && (
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="p-1 text-gray-500"
          >
            <MdClose size={22} />
          </button>
        )}
      </div>

      {!isCollapsed && (
        <ul className="max-h-[40dvh] md:max-h-80 overflow-y-auto divide-y divide-gray-100">
          {items.map((item) => (
            <li key={item.id} className="px-4 py-2 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <p className="flex-1 truncate text-sm" title={item.file.name}>
                  {item.relative_path
                    ? `${item.relative_path}/${item.file.name}`
                    : item.file.name}
                </p>
                {item.status === "done" ? (
                  <MdCheckCircle className="text-green-500 shrink-0" />
                ) : item.status === "error" ? (
                  <MdErrorOutline className="text-red-400 shrink-0" />
                ) : (
                  <span className="text-xs text-gray-400 shrink-0">
                    {item.status === "uploading"
                      ? `${item.progress}%`
                      : statusLabel[item.status]}
                  </span>
                )}
              </div>
              {item.status === "uploading" && (
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-1 bg-blue-500 transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
              {item.status === "error" && (
                <p className="text-xs text-red-400">
                  {item.error} · {formatBytes(item.file.size)}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
