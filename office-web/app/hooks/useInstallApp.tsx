"use client";

import { useState, useSyncExternalStore } from "react";
import { MdIosShare, MdAddBox } from "react-icons/md";
import { Modal } from "@/app/components/Modal";
import {
  getInstallState,
  getServerInstallState,
  promptInstall,
  subscribeInstallState,
} from "@/app/lib/pwa";

// Install the portal as an app: the browser's dialog where there is one
// (Android, Chrome, Edge), step-by-step instructions on iPhone/iPad.
// Render `instructions` somewhere in the component using it.
export default function useInstallApp() {
  const { canPrompt, isIos, isStandalone } = useSyncExternalStore(
    subscribeInstallState,
    getInstallState,
    getServerInstallState
  );
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  const install = () => {
    if (canPrompt) promptInstall();
    else setInstructionsOpen(true);
  };

  const instructions = (
    <Modal
      open={instructionsOpen}
      onOpenChange={setInstructionsOpen}
      title={<span className="font-title text-xl">Instalar o app</span>}
      description="Adicione o portal à tela de início para abrir como um app."
      content={
        <ol className="flex flex-col gap-4 w-full mt-6 text-gray-700">
          <li className="flex items-center gap-3">
            <MdIosShare size={26} className="shrink-0 text-blue-500" />
            <span>
              No Safari, toque em <strong>Compartilhar</strong> na barra do
              navegador.
            </span>
          </li>
          <li className="flex items-center gap-3">
            <MdAddBox size={26} className="shrink-0 text-blue-500" />
            <span>
              Escolha <strong>Adicionar à Tela de Início</strong> e toque em{" "}
              <strong>Adicionar</strong>.
            </span>
          </li>
        </ol>
      }
    />
  );

  return {
    // Offered only where installing is possible and not done yet
    available: !isStandalone && (canPrompt || isIos),
    install,
    instructions,
  };
}
