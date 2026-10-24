"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdClose, MdExitToApp, MdInstallMobile } from "react-icons/md";
import useUser from "@/app/hooks/useUser";
import useInstallApp from "@/app/hooks/useInstallApp";
import { MenuGroup } from "../Sidebar/MenuGroup";
import { MenuItem } from "../Sidebar/MenuItem";
import { isActive, NAV_GROUPS } from "./nav-items";

interface MenuDrawerProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
}

// Full navigation for phones, opened from the tab bar's "Menu"
export function MenuDrawer({ open, onOpenChange }: MenuDrawerProps) {
  const pathname = usePathname();
  const { logoutUser } = useUser();
  const { available, install, instructions } = useInstallApp();
  const close = () => onOpenChange(false);

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="lg:hidden fixed inset-0 z-40 bg-gray-500 bg-opacity-30 backdrop-blur-sm" />
          <Dialog.Content className="lg:hidden fixed z-50 inset-y-0 right-0 w-[min(20rem,85vw)] bg-gray-100 shadow-xl flex flex-col overflow-y-auto pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center justify-between px-4 h-14 border-b border-gray-300">
              <Dialog.Title className="font-title font-bold text-lg">
                Menu
              </Dialog.Title>
              <Dialog.Close className="p-2 -mr-2" aria-label="Fechar menu">
                <MdClose size={26} color="#6b7280" />
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">
              Navegação do portal
            </Dialog.Description>

            <nav className="flex-1">
              {NAV_GROUPS.map((group) => (
                <MenuGroup key={group.title} title={group.title}>
                  {group.items.map((item) => (
                    <MenuItem
                      key={item.to}
                      to={item.to}
                      title={item.title}
                      icon={item.icon(20)}
                      active={isActive(pathname, item.to)}
                      onClick={close}
                    />
                  ))}
                </MenuGroup>
              ))}
            </nav>

            {available && (
              <button
                type="button"
                onClick={() => {
                  close();
                  install();
                }}
                className="flex items-center gap-3 mx-4 mt-4 px-4 min-h-[48px] rounded-lg text-blue-500 hover:bg-blue-50"
              >
                <MdInstallMobile size={22} />
                Instalar app
              </button>
            )}

            <Link
              href="/"
              onClick={() => {
                close();
                logoutUser();
              }}
              className="flex items-center gap-3 m-4 px-4 min-h-[48px] rounded-lg text-red-400 hover:bg-red-50"
            >
              <MdExitToApp size={22} />
              Sair
            </Link>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      {/* Outside the drawer, which closes before the instructions open */}
      {instructions}
    </>
  );
}
