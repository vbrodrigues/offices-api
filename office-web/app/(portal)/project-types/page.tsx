"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextInput } from "@/components/Form/TextInput";
import InfoCard from "@/components/InfoCard";
import { listProjectTypes } from "@/lib/api/office-api/project-types/list-project-types";
import { createProjectType } from "@/lib/api/office-api/project-types/create-project-type";
import UnauthorizedPage from "@/app/(errors)/unauthorized/page";
import useUser from "@/app/hooks/useUser";
// import { MdClose } from "react-icons/md";

const createProjectTypeSchema = z.object({
  name: z.string().min(3, "O nome deve conter no mínimo 3 caracteres."),
});

type CreateProjectTypeFormData = z.infer<typeof createProjectTypeSchema>;

const ProjectTypesPage = async () => {
  const { register, handleSubmit } = useForm<CreateProjectTypeFormData>({
    resolver: zodResolver(createProjectTypeSchema),
  });

  const { user } = useUser();

  console.log("Inside", user);

  if (Object.keys(user).length === 0) {
    return <UnauthorizedPage />;
  }

  const projectTypes = await listProjectTypes(user.access_token);

  const onSubmit: SubmitHandler<CreateProjectTypeFormData> = async ({
    name,
  }: CreateProjectTypeFormData) => {
    await createProjectType({ name, office_id: user.office_id });
  };

  return (
    <div className="flex flex-col gap-8 p-10">
      <h1 className="font-title text-2xl">Categorias de Projetos</h1>

      <InfoCard
        title="O que são categorias de projetos?"
        description={
          "Categorias de projetos são utilizadas para organizar os projetos de acordo com o tipo de serviço que está sendo prestado."
        }
      />

      <p className="mt-4 text-gray-700 text-lg">
        Essas são suas categorias de projeto cadastradas:
      </p>

      <div className="flex">
        <div className="flex gap-4">
          {projectTypes.map((projectType) => (
            <span
              key={projectType.id}
              className="flex gap-2 justify-center items-center border border-blue-500 bg-blue-100 rounded-full px-4 py-2 text-blue-900"
            >
              {/* <div className="hover:cursor-pointer">
                <MdClose color="rgb(30 58 138)" size={20} />
              </div> */}
              {projectType.name}
            </span>
          ))}
        </div>
      </div>

      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3 className="text-lg font-semibold">
            Cadastrar nova categoria de projeto
          </h3>
          <TextInput
            label="project_type"
            name="Categoria de Projeto"
            register={register}
            type="text"
          />
          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 py-3 rounded-lg text-gray-100 font-title tracking-wide hover:opacity-90 transition-opacity"
          >
            CADASTRAR
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectTypesPage;
