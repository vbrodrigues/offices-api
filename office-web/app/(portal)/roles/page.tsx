"use client";

import * as z from "zod";
import * as Toast from "@radix-ui/react-toast";
import { PageHeader } from "@/app/components/PageHeader";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";

import { TextInput } from "@/app/components/Form/TextInput";
import InfoCard from "@/app/components/InfoCard";
import RoundedLabel from "@/app/components/RoundedLabel";
import Button from "@/app/components/Button";
import { CornerToast } from "@/app/components/Toast/Toast";

import UnauthorizedPage from "@/app/(errors)/unauthorized/page";
import LoadingPage from "@/app/(portal)/loading";
import useOfficeData from "@/app/hooks/useOfficeData";
import { useToast } from "@/app/hooks/useToast";

import { listRoles } from "@/app/lib/api/office-api/roles/list-roles";
import { createRole } from "@/app/lib/api/office-api/roles/create-role";

const createRoleSchema = z.object({
  label: z.string().min(3, "O nome deve conter no mínimo 3 caracteres."),
});

type CreateRoleFormData = z.infer<typeof createRoleSchema>;

const RolesPage = () => {
  const { user, data: roles, reload, isLoading } = useOfficeData(listRoles, []);

  const {
    showToast,
    setToastOpen,
    toastOpen,
    toastTitle,
    toastText,
    toastType,
  } = useToast();

  const { register, handleSubmit, formState, reset } =
    useForm<CreateRoleFormData>({
      resolver: zodResolver(createRoleSchema),
    });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <UnauthorizedPage />;
  }

  const onSubmit: SubmitHandler<CreateRoleFormData> = async ({
    label,
  }: CreateRoleFormData) => {
    try {
      await createRole({ label }, user.access_token);
      reset();
      await reload();
    } catch (err) {
      showToast("Oops!", "Erro ao criar cargo.", "error");
    }
  };

  return (
    <Toast.Provider swipeDirection="right" duration={5000}>
      <div className="flex flex-col gap-8">
        <PageHeader title="Cargos" />

        <InfoCard
          title="O que são cargos?"
          description="Cargos definem a função de cada colaborador no escritório. Você escolhe um cargo ao cadastrar um novo colaborador."
        />

        <p className="mt-4 text-gray-700 text-lg">
          Esses são os cargos cadastrados:
        </p>

        <div className="flex gap-3 sm:gap-4 flex-wrap">
          {roles.map((role) => (
            <RoundedLabel
              key={role.id}
              label={role.label}
              isDeleteable={false}
            />
          ))}
        </div>

        <div className="bg-gray-100 p-5 sm:p-8 rounded-lg shadow-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <h3 className="text-lg font-semibold">Cadastrar novo cargo</h3>
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-[minmax(0,24rem)_auto] sm:items-center">
              <TextInput
                label="Cargo"
                name="label"
                register={register}
                error={!!formState.errors.label}
                type="text"
              />
              <Button text="CADASTRAR" type="submit" size="small" fill />
            </div>
          </form>
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

export default RolesPage;
