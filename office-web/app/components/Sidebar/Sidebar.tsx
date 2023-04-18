import { MenuGroup } from "./MenuGroup";
import { MenuItem } from "./MenuItem";
import { MdOutlineFolderCopy, MdOutlineFolderSpecial } from "react-icons/md";
import { FaRegAddressCard } from "react-icons/fa";
import { TbUserCheck, TbUsers } from "react-icons/tb";

export function Sidebar() {
  return (
    <aside className="w-72 h-full border-r border-r-gray-300 mr-16">
      <MenuGroup title="MINHA EMPRESA">
        <MenuItem
          to="/employees"
          title="Colaboradores"
          icon={<TbUsers size={20} color="#6b7280" />}
        />
      </MenuGroup>
      <MenuGroup title="CLIENTES">
        <MenuItem
          to="/clients"
          title="Clientes"
          icon={<FaRegAddressCard size={20} color="#6b7280" />}
        />
        <MenuItem
          to="/projects"
          title="Projetos"
          icon={<MdOutlineFolderCopy size={20} color="#6b7280" />}
        />
      </MenuGroup>
      <MenuGroup title="CONFIGURAÇÕES">
        <MenuItem
          to="/roles"
          title="Cargos"
          icon={<TbUserCheck size={20} color="#6b7280" />}
        />
        <MenuItem
          to="/project-types"
          title="Categorias de projetos"
          icon={<MdOutlineFolderSpecial size={20} color="#6b7280" />}
        />
      </MenuGroup>
    </aside>
  );
}
