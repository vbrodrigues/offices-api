"use client";

import * as Toast from "@radix-ui/react-toast";
import { FaRegAddressCard } from "react-icons/fa";
import { Modal } from "@/app/components/Modal";
import { ActionLabel, PageHeader } from "@/app/components/PageHeader";
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
      <div className="w-full max-w-[90rem]">
        <PageHeader
          title="Clientes"
          action={
            <Modal
              trigger={
                <ActionLabel
                  icon={<FaRegAddressCard size={22} color="#f3f4f6" />}
                  label="Adicionar cliente"
                />
              }
              title={
                <div className="flex gap-4 items-center">
                  <FaRegAddressCard size={40} color="#3b82f6" />
                  <strong className="text-2xl font-title">
                    Adicionar cliente
                  </strong>
                </div>
              }
              description="Com o e-mail e a senha, o cliente pode acompanhar os projetos dele."
              content={<CreateClientForm onCreated={reload} />}
            />
          }
        >
          <p className="text-gray-700 text-lg">
            Sua empresa possui <strong>{clients.length}</strong> clientes.
          </p>
        </PageHeader>

        {/* min() keeps a single full-width column on narrow phones */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,22rem),1fr))] gap-4 md:gap-6">
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
