"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistance } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { CaretRight, Copy, Pencil, Trash } from "@phosphor-icons/react";
import { FaRegAddressCard } from "react-icons/fa";
import { Modal } from "../Modal";
import EditClientForm from "../Form/EditClientForm";
import { ConfirmRemoval } from "../ConfirmRemoval";
import { Client } from "@/app/lib/api/office-api/clients/dtos";
import { deleteClient } from "@/app/lib/api/office-api/clients/delete-client";
import useUser from "@/app/hooks/useUser";

type NotifyType = "info" | "success" | "error";

interface ClientCardProps {
  client: Client;
  onChanged: () => void;
  onNotify: (title: string, text: string, type: NotifyType) => void;
}

export function ClientCard({ client, onChanged, onNotify }: ClientCardProps) {
  const { user } = useUser();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(client.email);
      onNotify("Copiado!", "E-mail copiado.", "info");
    } catch (err) {
      onNotify("Oops!", "Não foi possível copiar o e-mail.", "error");
    }
  };

  const handleRemove = async () => {
    if (!user) return;

    try {
      await deleteClient(client.id, user.access_token);
      setIsRemoveOpen(false);
      onNotify("Sucesso!", "Cliente removido.", "success");
      onChanged();
    } catch (err) {
      onNotify("Oops!", "Erro ao remover cliente.", "error");
    }
  };

  const phoneDigits = client.phone_number?.replace(/\D/g, "");

  return (
    <div className=" bg-gray-100 rounded-lg border border-gray-300">
      <div className="p-5 sm:p-8 flex flex-col w-full max-w-xl">
        <div className="flex justify-between items-start gap-3">
          <span className="flex gap-4 items-center min-w-0">
            <h3 className="font-title text-xl font-bold text-gray-500 break-words min-w-0">
              {client.name}
            </h3>
          </span>
          <Modal
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            trigger={
              <span className="flex gap-2 items-center min-h-[44px] sm:min-h-0 hover:cursor-pointer hover:opacity-80 transition-opacity">
                <Pencil size={20} color="#3b82f6" />
                <p className="text-blue-500 text-lg">Editar</p>
              </span>
            }
            title={
              <div className="flex gap-6 items-center">
                <FaRegAddressCard size={48} color="#3b82f6" />
                <strong className="text-2xl font-title">Editar cliente</strong>
              </div>
            }
            description="Atualize as informações do cliente."
            content={
              <EditClientForm
                client={client}
                onSaved={() => {
                  setIsEditOpen(false);
                  onNotify("Sucesso!", "Cliente atualizado.", "success");
                  onChanged();
                }}
                onError={(message) => onNotify("Oops!", message, "error")}
              />
            }
          />
        </div>

        <span className="flex gap-2 items-center mt-1">
          <p className="text-gray-500 break-all min-w-0">{client.email}</p>
          <button
            type="button"
            aria-label="Copiar e-mail"
            onClick={handleCopyEmail}
            className="p-2 -m-2 shrink-0"
          >
            <Copy size={20} color="#6b7280" />
          </button>
        </span>

        <span className="flex flex-wrap gap-x-2 gap-y-1 mt-4 items-center">
          {phoneDigits ? (
            <>
              <p className="text-gray-500">{client.phone_number}</p>
              <a
                href={`tel:${phoneDigits}`}
                className="text-blue-500 hover:opacity-80 transition-opacity"
              >
                Entrar em contato
              </a>
            </>
          ) : (
            <p className="text-gray-400">Sem telefone</p>
          )}
        </span>

        <footer className="flex flex-wrap justify-between items-center gap-2 mt-4">
          <p className="text-sm text-gray-400">
            Cliente{" "}
            {formatDistance(new Date(client.created_at), new Date(), {
              addSuffix: true,
              locale: ptBR,
            })}
          </p>
          <Modal
            open={isRemoveOpen}
            onOpenChange={setIsRemoveOpen}
            trigger={
              <span className="flex gap-2 items-center min-h-[44px] sm:min-h-0 hover:cursor-pointer hover:opacity-80 transition-opacity">
                <Trash size={18} color="#f87171" />
                <p className="text-red-400">Remover</p>
              </span>
            }
            title={
              <div className="flex gap-6 items-center">
                <Trash size={48} color="#f87171" />
                <strong className="text-2xl font-title">
                  Remover {client.name}?
                </strong>
              </div>
            }
            description="Essa ação não pode ser desfeita pelo portal."
            content={
              <ConfirmRemoval
                message="O cliente sai da sua lista e perde o acesso ao portal. Os projetos dele continuam salvos."
                onConfirm={handleRemove}
                onCancel={() => setIsRemoveOpen(false)}
              />
            }
          />
        </footer>
      </div>
      <Link
        href={`/projects?client_id=${client.id}`}
        className="bg-blue-100 border-t border-t-blue-200 rounded-b-lg px-4 py-4 hover:opacity-80 transition-opacity hover:cursor-pointer flex justify-center items-center"
      >
        <span className="flex gap-4 items-center">
          <p className="text-lg text-blue-500">Ver projetos</p>
          <CaretRight size={20} color="#3b82f6" />
        </span>
      </Link>
    </div>
  );
}
