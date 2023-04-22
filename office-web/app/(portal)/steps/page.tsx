"use client";

import { useState } from "react";
import * as z from "zod";
import { useRouter } from "next/navigation";
import * as Toast from "@radix-ui/react-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";

import { TextInput } from "@/app/components/Form/TextInput";
import InfoCard from "@/app/components/InfoCard";
import RoundedLabel from "@/app/components/RoundedLabel";
import WarningCard from "@/app/components/WarningCard";
import Button from "@/app/components/Button";
import { ErrorToast } from "@/app/components/Toast/Toast";

import UnauthorizedPage from "@/app/(errors)/unauthorized/page";
import useUser from "@/app/hooks/useUser";

import { listSteps } from "@/app/lib/api/office-api/steps/list-steps";
import { createStep } from "@/app/lib/api/office-api/steps/create-step";
import { deleteStep } from "@/app/lib/api/office-api/steps/delete-step";

const createStepSchema = z.object({
  name: z.string().min(3, "O nome deve conter no mínimo 3 caracteres."),
});

type CreateStepFormData = z.infer<typeof createStepSchema>;

const StepsPage = async () => {
  const { refresh } = useRouter();

  const [toastOpen, setToastOpen] = useState(false);

  const { register, handleSubmit, formState } = useForm<CreateStepFormData>({
    resolver: zodResolver(createStepSchema),
  });

  const { getCurrentUser } = useUser();
  const user = await getCurrentUser();

  if (!user) {
    return <UnauthorizedPage />;
  }

  const steps = await listSteps(user.access_token);

  const onSubmit: SubmitHandler<CreateStepFormData> = async ({
    name,
  }: CreateStepFormData) => {
    try {
      await createStep(
        {
          name,
          office_id: user.office_id,
        },
        user.access_token
      );
      refresh();
    } catch (err) {
      setToastOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStep(id, user.access_token);
      refresh();
    } catch (err) {
      setToastOpen(true);
    }
  };

  return (
    <Toast.Provider swipeDirection="right" duration={5000}>
      <div className="flex flex-col gap-8 p-10">
        <h1 className="font-title text-2xl">Etapas de projeto</h1>

        <InfoCard
          title="O que são etapas de projetos?"
          description={
            "Etapas de projeto definem como você irá dividir o andamento do seu projeto. Isso pode auxiliar na organização, cronograma e distribuição do projeto."
          }
        />

        <WarningCard
          title="Lembre-se!"
          description="Ao excluir uma etapa, projetos que possuem essa etapa não terão mais essa etapa associada. Você vai precisar re-associar essa etapa aos projetos que desejar caso realize a exclusão."
        />

        <p className="mt-4 text-gray-700 text-lg">
          Essas são suas etapas de projeto cadastradas:
        </p>

        <div className="">
          <div className="flex gap-4 flex-wrap ">
            {steps.map((step) => (
              <RoundedLabel
                key={step.id}
                label={step.name}
                isDeleteable
                onDelete={() => handleDelete(step.id)}
              />
            ))}
          </div>
        </div>

        <div className="bg-gray-100 p-8 rounded-lg shadow-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className=" flex flex-col gap-4"
          >
            <h3 className="text-lg font-semibold">Cadastrar nova etapa</h3>
            <div className="flex gap-4">
              <div className="">
                <TextInput
                  label="Etapa"
                  name="name"
                  register={register}
                  error={!!formState.errors.name}
                  type="text"
                />
              </div>
              <Button text="CADASTRAR" type="submit" size="small" fill />
            </div>
          </form>
        </div>

        <ErrorToast
          open={toastOpen}
          setOpen={setToastOpen}
          title="Oops"
          text="Erro ao criar etapa. Por favor, tente novamente mais tarde."
        />
      </div>
    </Toast.Provider>
  );
};

export default StepsPage;
