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

const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve conter pelo menos 3 caracteres.")
    .max(100, "O nome deve conter no máximo 100 caracteres."),
  steps: z.array(z.string()),
  client_id: z.string(),
});

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

interface CreateProjectFormProps {
  steps: Step[];
  clients: Client[];
}

const CreateProjectForm = ({ steps, clients }: CreateProjectFormProps) => {
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
  const selectedSteps = watch("steps");

  const handleClientSelect = (selectedOption: any) => {
    setValue("client_id", selectedOption.value);
  };

  const handleStepsSelect = (selectedOption: any) => {
    setValue(
      "steps",
      selectedOption.map((option: any) => option.value)
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

      <SelectInput
        label="Cliente"
        onChange={handleClientSelect}
        // value={selectedClient}
        options={clients.map((client) => ({
          value: client.id,
          label: client.name,
          icon: (
            <AvatarCircle name={client.name} image={client.logo} size="small" />
          ),
        }))}
      />

      <SelectInput
        isMulti
        label="Passos"
        onChange={handleStepsSelect}
        options={steps.map((step) => ({
          value: step.id,
          label: step.name,
        }))}
      />

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
