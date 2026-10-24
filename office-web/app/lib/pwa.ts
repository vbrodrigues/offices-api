"use client";

// Install state of the portal as an app, shared by the banner and the menu.
// The browser fires beforeinstallprompt once, possibly before React mounts,
// so it is captured here as soon as this module loads.

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export interface InstallState {
  // Chrome/Edge/Android: the browser's own install dialog can be opened
  canPrompt: boolean;
  // iPhone/iPad Safari: no dialog, the user adds it from the share menu
  isIos: boolean;
  // Already running as an installed app
  isStandalone: boolean;
}

const SERVER_STATE: InstallState = {
  canPrompt: false,
  isIos: false,
  isStandalone: false,
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let state = SERVER_STATE;
const listeners = new Set<() => void>();

function update(next: Partial<InstallState>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  const ua = window.navigator.userAgent;
  state = {
    canPrompt: false,
    // iPadOS reports itself as a Mac, but with touch
    isIos:
      /iphone|ipad|ipod/i.test(ua) ||
      (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1),
    isStandalone:
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true,
  };

  window.addEventListener("beforeinstallprompt", (event) => {
    // Keep the browser's mini-infobar from showing; we offer it ourselves
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    update({ canPrompt: true });
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    update({ canPrompt: false, isStandalone: true });
  });
}

export function subscribeInstallState(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getInstallState = () => state;
export const getServerInstallState = () => SERVER_STATE;

// Opens the browser's install dialog. It can be used only once.
export async function promptInstall() {
  if (!deferredPrompt) return;
  const prompt = deferredPrompt;
  deferredPrompt = null;
  update({ canPrompt: false });
  await prompt.prompt();
  await prompt.userChoice;
}
