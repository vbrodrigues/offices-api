import Logo from "../components/Logo";

// Shown by the service worker when a page can't be loaded without internet.
// Static, so the worker can keep a copy of it.
export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <main className="flex flex-col items-center justify-center gap-6 min-h-[100dvh] px-4 text-center">
      <Logo big />
      <div className="flex flex-col gap-2 max-w-sm">
        <h2 className="font-title text-xl">Sem conexão</h2>
        <p className="text-gray-500">
          Não foi possível carregar esta página. Verifique sua internet e tente
          de novo.
        </p>
      </div>
      {/* A plain link: a full reload goes back through the network */}
      <a
        href="/projects"
        className="flex items-center min-h-[44px] px-6 rounded-lg bg-blue-500 text-gray-100 font-title tracking-wide"
      >
        Tentar de novo
      </a>
    </main>
  );
}
