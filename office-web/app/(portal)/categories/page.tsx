"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextInput } from "@/app/components/Form/TextInput";
import InfoCard from "@/app/components/InfoCard";
import { listCategories } from "@/app/lib/api/office-api/categories/list-categories";
import { createCategory } from "@/app/lib/api/office-api/categories/create-category";
import UnauthorizedPage from "@/app/(errors)/unauthorized/page";
import useUser from "@/app/hooks/useUser";
import { useRouter } from "next/navigation";
import { ErrorToast } from "@/app/components/Toast/Toast";
import { useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import { deleteCategory } from "@/app/lib/api/office-api/categories/delete-category";
import RoundedLabel from "@/app/components/RoundedLabel";
import WarningCard from "@/app/components/WarningCard";
import Button from "@/app/components/Button";

const createCategorySchema = z.object({
  name: z.string().min(3, "O nome deve conter no mínimo 3 caracteres."),
});

type CreateCategoryFormData = z.infer<typeof createCategorySchema>;

const CategoriesPage = async () => {
  const { refresh } = useRouter();

  const [toastOpen, setToastOpen] = useState(false);

  const { register, handleSubmit, formState } = useForm<CreateCategoryFormData>(
    {
      resolver: zodResolver(createCategorySchema),
    }
  );

  const { getCurrentUser } = useUser();
  const user = await getCurrentUser();

  if (!user) {
    return <UnauthorizedPage />;
  }

  const categories = await listCategories(user.access_token);

  const onSubmit: SubmitHandler<CreateCategoryFormData> = async ({
    name,
  }: CreateCategoryFormData) => {
    try {
      await createCategory(
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
      await deleteCategory(id, user.access_token);
      refresh();
    } catch (err) {
      setToastOpen(true);
    }
  };

  return (
    <Toast.Provider swipeDirection="right" duration={5000}>
      <div className="flex flex-col gap-8 p-10">
        <h1 className="font-title text-2xl">Categorias</h1>

        <InfoCard
          title="O que são categorias de arquivos de projetos?"
          description={
            "Categorias de arquivos são utilizadas para organizar os arquivos de acordo com o tipo de serviço que está sendo prestado, ou da forma que preferir."
          }
        />

        <WarningCard
          title="Lembre-se!"
          description="Ao excluir uma categoria, arquivos dessa categoria ficarão sem nenhuma categoria associada. Você vai precisar re-associar essa categoria aos arquivos que desejar caso realize a exclusão."
        />

        <p className="mt-4 text-gray-700 text-lg">
          Essas são suas categorias cadastradas:
        </p>

        <div className="">
          <div className="flex gap-4 flex-wrap ">
            {categories.map((category) => (
              <RoundedLabel
                key={category.id}
                label={category.name}
                isDeleteable
                onDelete={() => handleDelete(category.id)}
              />
            ))}
          </div>
        </div>

        <div className="bg-gray-100 p-8 rounded-lg shadow-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className=" flex flex-col gap-4"
          >
            <h3 className="text-lg font-semibold">Cadastrar nova categoria</h3>
            <div className="flex gap-4">
              <div className="">
                <TextInput
                  label="Categoria"
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
          text="Erro ao criar categoria. Por favor, tente novamente mais tarde."
        />
      </div>
    </Toast.Provider>
  );
};

export default CategoriesPage;
