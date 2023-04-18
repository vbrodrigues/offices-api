"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextInput } from "@/app/components/Form/TextInput";
import InfoCard from "@/app/components/InfoCard";
import { listProjectTypes } from "@/app/lib/api/office-api/project-types/list-project-types";
import { createProjectType } from "@/app/lib/api/office-api/project-types/create-project-type";
import UnauthorizedPage from "@/app/(errors)/unauthorized/page";
import useUser from "@/app/hooks/useUser";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/navigation";
import { ErrorToast } from "@/app/components/Toast/Toast";
import { useState } from "react";
import * as Toast from "@radix-ui/react-toast";

const createProjectTypeSchema = z.object({
  name: z.string().min(3, "O nome deve conter no mínimo 3 caracteres."),
});

type CreateProjectTypeFormData = z.infer<typeof createProjectTypeSchema>;

const ProjectTypesPage = async () => {
  const { refresh } = useRouter();

  const [toastOpen, setToastOpen] = useState(false);

  const { register, handleSubmit, formState } =
    useForm<CreateProjectTypeFormData>({
      resolver: zodResolver(createProjectTypeSchema),
    });

  const { getCurrentUser } = useUser();
  const user = await getCurrentUser();

  if (!user) {
    return <UnauthorizedPage />;
  }

  const projectTypes = await listProjectTypes(user.access_token);

  const onSubmit: SubmitHandler<CreateProjectTypeFormData> = async ({
    name,
  }: CreateProjectTypeFormData) => {
    try {
      await createProjectType(
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

  return (
    <Toast.Provider swipeDirection="right" duration={5000}>
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

        <div className="">
          <div className="flex gap-4 flex-wrap ">
            {projectTypes.map((projectType) => (
              <div
                key={projectType.id}
                className="flex gap-2 justify-center items-center border border-blue-500 bg-blue-100 rounded-full px-4 py-2 text-blue-900"
              >
                <div className="hover:cursor-pointer">
                  <MdClose color="rgb(30 58 138)" size={20} />
                </div>
                {projectType.name}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-100 p-8 rounded-lg shadow-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className=" flex flex-col gap-4"
          >
            <h3 className="text-lg font-semibold">
              Cadastrar nova categoria de projeto
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <TextInput
                  label="Categoria de Projeto"
                  name="name"
                  register={register}
                  error={!!formState.errors.name?.message}
                  type="text"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 py-3 rounded-lg text-gray-100 font-title hover:opacity-90 transition-opacity"
            >
              CADASTRAR
            </button>
          </form>
        </div>

        <ErrorToast
          open={toastOpen}
          setOpen={setToastOpen}
          title="Oops"
          text="Erro ao criar categoria de projeto. Por favor, tente novamente mais tarde."
        />
      </div>
    </Toast.Provider>
  );
};

export default ProjectTypesPage;
