"use client";

import { useEffect, useState } from "react";
import { MdRefresh } from "react-icons/md";

const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID ?? "dev";
const CHECK_EVERY_MS = 5 * 60 * 1000;

async function deployedBuild() {
  try {
    const response = await fetch("/api/version", { cache: "no-store" });
    if (!response.ok) return null;
    return ((await response.json()) as { build: string }).build;
  } catch (err) {
    return null;
  }
}

// Registers the service worker (production only; it needs HTTPS, or
// localhost) and tells the user when a new version was deployed while the
// tab was open: its pages and chunks may no longer exist on the server.
export function ServiceWorker() {
  const [outdated, setOutdated] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    if ("serviceWorker" in navigator && window.isSecureContext) {
      navigator.serviceWorker
        .register(`/sw.js?v=${encodeURIComponent(BUILD_ID)}`)
        .catch(() => {});
    }

    const check = async () => {
      const build = await deployedBuild();
      if (build && build !== BUILD_ID) setOutdated(true);
    };

    // Phones keep installed apps in the background for days: check when the
    // app comes back to the front, and every few minutes while it's open
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);
    const interval = window.setInterval(check, CHECK_EVERY_MS);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(interval);
    };
  }, []);

  if (!outdated) return null;

  return (
    <div
      role="status"
      className="fixed z-50 inset-x-4 top-[calc(env(safe-area-inset-top)+0.75rem)] flex items-center gap-3 rounded-lg bg-gray-800 text-gray-100 shadow-lg px-4 py-3 lg:inset-x-auto lg:top-auto lg:right-6 lg:bottom-6 lg:w-96"
    >
      <span className="flex-1 text-sm">Nova versão disponível.</span>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="flex items-center gap-2 min-h-[44px] px-3 rounded-lg font-bold text-blue-300 hover:bg-gray-700"
      >
        <MdRefresh size={20} />
        Atualizar
      </button>
    </div>
  );
}
