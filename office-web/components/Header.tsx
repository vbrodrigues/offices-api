import { deleteCookie } from "cookies-next";
import Link from "next/link";
import { MdExitToApp } from "react-icons/md";
import Logo from "./Logo";

export function Header() {
  function logOut() {
    deleteCookie("access_token");
  }

  return (
    <header className="w-full h-[72px] flex justify-between items-center border-b p-12">
      <Logo />
      <Link
        href="/"
        onClick={logOut}
        className="ml-auto flex gap-2 justify-center items-center text-gray-500 hover:text-blue-500 transition-colors"
      >
        <MdExitToApp size={24} />
        <p>Sair</p>
      </Link>
    </header>
  );
}
