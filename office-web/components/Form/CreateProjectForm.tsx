"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextInput } from "./TextInput";
// import { useRouter } from "next/navigation";
import { Dropdown } from "./Dropdown";
import { createProject } from "@/lib/api/office-api/projects/create-project";

const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve conter pelo menos 3 caracteres.")
    .max(100, "O nome deve conter no máximo 100 caracteres."),
});

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

const CreateProjectForm = () => {
  const { register, handleSubmit, formState } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
  });

  const onSubmit: SubmitHandler<CreateProjectFormData> = async ({
    name,
  }: CreateProjectFormData) => {
    try {
      const createProjectResponse = await createProject({
        client_id: "",
        project_type_id: "",
        name,
      });

      console.log(createProjectResponse);
    } catch (err: Error | any) {
      throw new Error(err.response?.data.message);
    }
  };

  return (
    <form
      className="flex flex-col gap-8 w-full mt-10"
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

      <Dropdown label="Cliente" options={["Casa A", "Apartamento A"]} />

      <Dropdown
        label="Tipo"
        options={["Apartamento", "Casa", "Escritório", "Loja", "Consultório"]}
      />

      <button
        type="submit"
        className="w-full bg-blue-500 py-3 rounded-lg text-gray-100 font-title tracking-wide hover:opacity-90 transition-opacity"
      >
        CADASTRAR
      </button>
    </form>
  );
};

export default CreateProjectForm;
