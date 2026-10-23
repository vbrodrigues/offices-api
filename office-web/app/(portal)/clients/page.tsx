"use client";

import * as Toast from "@radix-ui/react-toast";
import { FaRegAddressCard } from "react-icons/fa";
import { Modal } from "@/app/components/Modal";
import { ClientCard } from "@/app/components/Client/ClientCard";
import CreateClientForm from "@/app/components/Form/CreateClientForm";
import { CornerToast } from "@/app/components/Toast/Toast";
import UnauthorizedPage from "@/app/(errors)/unauthorized/page";
import LoadingPage from "@/app/(portal)/loading";
import useOfficeData from "@/app/hooks/useOfficeData";
import { useToast } from "@/app/hooks/useToast";
import { listClients } from "@/app/lib/api/office-api/clients/list-clients";

const ClientsPage = () => {
  const {
    user,
    data: clients,
    reload,
    isLoading,
  } = useOfficeData(listClients, []);

  const {
    showToast,
    setToastOpen,
    toastOpen,
    toastTitle,
    toastText,
    toastType,
  } = useToast();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <UnauthorizedPage />;
  }

  return (
    <Toast.Provider swipeDirection="right" duration={5000}>
      <div className="p-10 w-full max-w-[90rem]">
        <div className="flex justify-between items-center">
          <h1 className="font-title text-2xl">Clientes</h1>

          <Modal
            trigger={
              <span className="bg-blue-500 py-3 px-6 rounded-lg text-gray-100 font-title tracking-wide hover:opacity-90 transition-opacity flex items-center gap-2">
                <FaRegAddressCard size={20} color="#f3f4f6" />
                Adicionar cliente
              </span>
            }
            title={
              <div className="flex gap-6 items-center">
                <FaRegAddressCard size={48} color="#3b82f6" />
                <strong className="text-2xl font-title">
                  Adicionar cliente
                </strong>
              </div>
            }
            description="Com o e-mail e a senha, o cliente pode acompanhar os projetos dele."
            content={<CreateClientForm onCreated={reload} />}
          />
        </div>

        <p className="mt-4 text-gray-700 text-lg">
          Sua empresa possui <strong>{clients.length}</strong> clientes.
        </p>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(22rem,1fr))] gap-6 mt-8">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onChanged={reload}
              onNotify={showToast}
            />
          ))}
        </div>

        <CornerToast
          type={toastType}
          open={toastOpen}
          setOpen={setToastOpen}
          title={toastTitle}
          text={toastText}
        />
      </div>
    </Toast.Provider>
  );
};

export default ClientsPage;
