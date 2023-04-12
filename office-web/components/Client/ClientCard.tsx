import { formatDistance } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { CaretRight, Copy, Pencil, Trash } from "phosphor-react";

interface ClientCardProps {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: Date | string;
}

export function ClientCard({
  id,
  name,
  email,
  phoneNumber,
  createdAt,
}: ClientCardProps) {
  return (
    <div className=" bg-gray-100 rounded-lg border border-gray-300">
      <div className=" p-8 flex flex-col w-full max-w-xl max-h-48">
        <div className="flex justify-between">
          <span className="flex gap-4 items-center">
            <h3 className="font-title text-xl font-bold text-gray-500">
              {name}
            </h3>
          </span>
          <span className="flex gap-2 items-center hover:cursor-pointer hover:opacity-80 transition-opacity">
            <Pencil size={20} color="#3b82f6" />
            <a className="text-blue-500 text-lg">Editar</a>
          </span>
        </div>

        <span className="flex gap-2 items-center mt-1">
          <p className="text-gray-500">{email}</p>
          <Copy size={20} color="#6b7280" className="hover:cursor-pointer" />
        </span>

        <span className="flex gap-2 mt-4 items-center text-center">
          <p className="text-gray-500">{phoneNumber}</p>
          <a
            href="#"
            className="text-blue-500 hover:opacity-80 transition-opacity"
          >
            Entrar em contato
          </a>
        </span>

        <footer className="flex justify-between mt-4">
          <p className="text-sm text-gray-400">
            Cliente{" "}
            {formatDistance(new Date(createdAt), new Date(), {
              addSuffix: true,
              locale: ptBR,
            })}
          </p>
          <span className="flex gap-2 items-center hover:cursor-pointer hover:opacity-80 transition-opacity">
            <Trash size={18} color="#f87171" />
            <p className="text-red-400">Remover</p>
          </span>
        </footer>
      </div>
      <div className="bg-blue-100 border-t border-t-blue-200 rounded-b-lg px-4 py-4 hover:opacity-80 transition-opacity hover:cursor-pointer flex justify-center items-center">
        <span className="flex gap-4 items-center">
          <p className="text-lg text-blue-500">Ver projetos</p>
          <CaretRight size={20} color="#3b82f6" />
        </span>
      </div>
    </div>
  );
}
