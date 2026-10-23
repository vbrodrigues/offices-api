"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextInput } from "./TextInput";
import { createProject } from "@/app/lib/api/office-api/projects/create-project";
import SelectInput from "./SelectInput";
import AvatarCircle from "../AvatarCircle";
import { Step } from "@/app/lib/api/office-api/steps/dtos";
import { Client } from "@/app/lib/api/office-api/clients/dtos";
import useUser from "@/app/hooks/useUser";
import { useToast } from "@/app/hooks/useToast";
import { CornerToast } from "../Toast/Toast";
import SortableList from "../SortableList";

const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve conter pelo menos 3 caracteres.")
    .max(100, "O nome deve conter no máximo 100 caracteres."),
  steps: z.array(z.string()).optional(),
  client_id: z.string(),
});

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

interface CreateProjectFormProps {
  steps: Step[];
  clients: Client[];
  onCreated?: () => void;
}

const CreateProjectForm = ({
  steps,
  clients,
  onCreated,
}: CreateProjectFormProps) => {
  const { getCurrentUser } = useUser();

  const {
    showToast,
    setToastOpen,
    toastOpen,
    toastTitle,
    toastText,
    toastType,
  } = useToast();

  const { register, handleSubmit, formState, setValue, watch, reset } =
    useForm<CreateProjectFormData>({
      resolver: zodResolver(createProjectSchema),
    });

  const selectedClient = watch("client_id");
  // Ordered: the project's steps are created in this order
  const selectedSteps = watch("steps") ?? [];

  const clientOptions = clients.map((client) => ({
    value: client.id,
    label: client.name,
    icon: <AvatarCircle name={client.name} image={client.logo} size="small" />,
  }));

  const stepOptions = steps.map((step) => ({
    value: step.id,
    label: step.name,
  }));

  const orderedSteps = selectedSteps
    .map((step_id) => steps.find((step) => step.id === step_id))
    .filter((step): step is Step => !!step);

  const handleClientSelect = (selectedOption: any) => {
    setValue("client_id", selectedOption?.value, { shouldValidate: true });
  };

  const handleStepsSelect = (selectedOptions: any) => {
    setValue(
      "steps",
      (selectedOptions ?? []).map((option: any) => option.value)
    );
  };

  const handleStepsReorder = (reordered: Step[]) => {
    setValue(
      "steps",
      reordered.map((step) => step.id)
    );
  };

  const onSubmit: SubmitHandler<CreateProjectFormData> = async ({
    name,
  }: CreateProjectFormData) => {
    try {
      const user = await getCurrentUser();

      if (user) {
        await createProject(
          {
            client_id: selectedClient,
            steps: selectedSteps,
            name,
          },
          user?.access_token
        );
      }

      showToast("Sucesso!", "Projeto criado com sucesso!", "success");
      reset();
      onCreated?.();
    } catch (err: Error | any) {
      if (err.message === "Project already exists.") {
        showToast("Oops!", "Um projeto com esse nome já existe.", "error");
      } else {
        showToast("Oops!", "Erro ao criar um projeto.", "error");
      }
    }
  };

  return (
    <form
      className="flex flex-col flex-wrap gap-8 w-full mt-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <p className="font-title text-gray-500">{"Nome do projeto"}</p>
          {formState.errors.name && (
            <p className="text-red-400 text-xs">
              {formState.errors.name.message}
            </p>
          )}
        </div>
        <TextInput
          name="name"
          label="Nome do projeto"
          type="text"
          error={!!formState.errors.name}
          register={register}
        />
      </div>

      <div className="flex flex-col gap-1">
        <SelectInput
          label="Cliente"
          onChange={handleClientSelect}
          value={
            clientOptions.find((option) => option.value === selectedClient) ??
            null
          }
          options={clientOptions}
        />
        {formState.errors.client_id && (
          <p className="text-red-400 text-xs">Escolha um cliente.</p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <SelectInput
          isMulti
          label="Etapas"
          onChange={handleStepsSelect}
          value={orderedSteps.map((step) => ({
            value: step.id,
            label: step.name,
          }))}
          options={stepOptions}
        />

        {orderedSteps.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500">
              Ordem das etapas (arraste para reordenar):
            </p>
            <SortableList
              items={orderedSteps}
              onReorder={handleStepsReorder}
              renderItem={(step) => (
                <span className="text-gray-700">{step.name}</span>
              )}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 py-3 rounded-lg text-gray-100 font-title tracking-wide hover:opacity-90 transition-opacity"
      >
        CADASTRAR
      </button>

      <CornerToast
        type={toastType}
        open={toastOpen}
        setOpen={setToastOpen}
        title={toastTitle}
        text={toastText}
      />
    </form>
  );
};

export default CreateProjectForm;
