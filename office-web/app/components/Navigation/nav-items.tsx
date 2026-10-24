import { ReactElement } from "react";
import { MdOutlineFolderCopy } from "react-icons/md";
import { FaRegAddressCard } from "react-icons/fa";
import { TbUserCheck, TbUsers } from "react-icons/tb";
import { BsBarChartSteps, BsFileEarmarkMedical } from "react-icons/bs";

export interface NavItem {
  to: string;
  title: string;
  // Shorter label for the phone tab bar
  shortTitle?: string;
  icon: (size: number) => ReactElement;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

const employees: NavItem = {
  to: "/employees",
  title: "Colaboradores",
  shortTitle: "Equipe",
  icon: (size) => <TbUsers size={size} />,
};
const clients: NavItem = {
  to: "/clients",
  title: "Clientes",
  icon: (size) => <FaRegAddressCard size={size} />,
};
const projects: NavItem = {
  to: "/projects",
  title: "Projetos",
  icon: (size) => <MdOutlineFolderCopy size={size} />,
};

// One list for the sidebar (desktop), the tab bar and the menu (phones)
export const NAV_GROUPS: NavGroup[] = [
  { title: "MINHA EMPRESA", items: [employees] },
  { title: "CLIENTES", items: [clients, projects] },
  {
    title: "CONFIGURAÇÕES",
    items: [
      {
        to: "/roles",
        title: "Cargos",
        icon: (size) => <TbUserCheck size={size} />,
      },
      {
        to: "/categories",
        title: "Categorias de arquivos",
        icon: (size) => <BsFileEarmarkMedical size={size} />,
      },
      {
        to: "/steps",
        title: "Etapas de projetos",
        icon: (size) => <BsBarChartSteps size={size} />,
      },
    ],
  },
];

// Most used pages, always one tap away on phones; the rest is in the menu
export const TAB_ITEMS: NavItem[] = [projects, clients, employees];

export function isActive(pathname: string | null, to: string) {
  return !!pathname && (pathname === to || pathname.startsWith(`${to}/`));
}
