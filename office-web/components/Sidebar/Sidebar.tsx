import {
  AddressBook,
  Folders,
  FolderSimpleDotted,
  UserGear,
  Users,
} from "phosphor-react";
import { MenuGroup } from "./MenuGroup";
import { MenuItem } from "./MenuItem";

export function Sidebar() {
  return (
    <aside className="w-72 h-full border-r border-r-gray-300 mr-16">
      <MenuGroup title="MINHA EMPRESA">
        <MenuItem
          to="/users"
          title="Colaboradores"
          icon={<Users size={20} color="#6b7280" />}
        />
      </MenuGroup>
      <MenuGroup title="CLIENTES">
        <MenuItem
          to="/clients"
          title="Clientes"
          icon={<AddressBook size={20} color="#6b7280" />}
        />
        <MenuItem
          to="/projects"
          title="Projetos"
          icon={<Folders size={20} color="#6b7280" />}
        />
      </MenuGroup>
      <MenuGroup title="CONFIGURAÇÕES">
        <MenuItem
          title="Cargos"
          icon={<UserGear size={20} color="#6b7280" />}
        />
        <MenuItem
          title="Tipos de projeto"
          icon={<FolderSimpleDotted size={20} color="#6b7280" />}
        />
      </MenuGroup>
    </aside>
  );
}
