"use client";

import { useEffect, useState } from "react";
import { MdClose, MdInstallMobile } from "react-icons/md";
import useInstallApp from "@/app/hooks/useInstallApp";

const DISMISSED_KEY = "office-install-dismissed-at";
const HIDE_FOR_MS = 30 * 24 * 60 * 60 * 1000;

function dismissedRecently() {
  try {
    const at = Number(window.localStorage.getItem(DISMISSED_KEY));
    return Boolean(at) && Date.now() - at < HIDE_FOR_MS;
  } catch (err) {
    return false;
  }
}

// Invitation to install the portal on phones and tablets. Closing it hides
// it for 30 days; the menu keeps an "Instalar app" item meanwhile.
export function InstallBanner() {
  const { available, install, instructions } = useInstallApp();
  // Starts hidden so server and first client render match
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => setDismissed(dismissedRecently()), []);

  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch (err) {
      // Private mode: it just shows again next time
    }
  };

  return (
    <>
      {available && !dismissed && (
        <div className="lg:hidden flex items-center gap-3 mb-6 rounded-lg border border-blue-200 bg-blue-50 pl-4 pr-2 py-2">
          <MdInstallMobile size={26} className="shrink-0 text-blue-500" />
          <p className="flex-1 text-sm text-gray-700">
            Instale o app para abrir o portal direto da tela de início.
          </p>
          <button
            type="button"
            onClick={install}
            className="min-h-[44px] px-3 rounded-lg font-bold text-blue-500 hover:bg-blue-100"
          >
            Instalar
          </button>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dispensar"
            className="flex items-center justify-center w-11 h-11 rounded-lg text-gray-400 hover:bg-blue-100"
          >
            <MdClose size={22} />
          </button>
        </div>
      )}
      {instructions}
    </>
  );
}
