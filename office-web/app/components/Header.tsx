import Link from "next/link";
import { MdExitToApp } from "react-icons/md";
import Logo from "./Logo";
import useUser from "@/app/hooks/useUser";

export function Header() {
  const { logoutUser } = useUser();

  return (
    <header className="sticky top-0 z-30 w-full bg-gray-200/95 backdrop-blur border-b pt-[env(safe-area-inset-top)]">
      <div className="h-14 lg:h-[72px] flex justify-between items-center px-4 md:px-8 lg:px-12">
        <Link href="/projects" aria-label="Início">
          <Logo />
        </Link>
        {/* On phones "Sair" lives in the menu of the tab bar */}
        <Link
          href="/"
          onClick={logoutUser}
          className="hidden lg:flex ml-auto gap-2 justify-center items-center text-gray-500 hover:text-blue-500 transition-colors"
        >
          <MdExitToApp size={24} />
          <p>Sair</p>
        </Link>
      </div>
    </header>
  );
}
