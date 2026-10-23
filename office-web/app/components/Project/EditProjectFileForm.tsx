"use client";

import { useState } from "react";
import SelectInput from "../Form/SelectInput";
import useUser from "@/app/hooks/useUser";
import { Category } from "@/app/lib/api/office-api/categories/dtos";
import { ProjectFile } from "@/app/lib/api/office-api/projects/dtos";
import { updateProjectFile } from "@/app/lib/api/office-api/project-files/update-project-file";

interface SelectOption {
  value: string;
  label: string;
}

interface EditProjectFileFormProps {
  file: ProjectFile;
  categories: Category[];
  // The project's steps, as options (value = ProjectStep id)
  stepOptions: SelectOption[];
  onSaved: () => void;
  // eslint-disable-next-line no-unused-vars
  onError: (message: string) => void;
}

// Changes the category and the project step of an uploaded file
export default function EditProjectFileForm({
  file,
  categories,
  stepOptions,
  onSaved,
  onError,
}: EditProjectFileFormProps) {
  const { user } = useUser();
  const [categoryId, setCategoryId] = useState(file.category_id);
  const [projectStepId, setProjectStepId] = useState(file.project_step_id);
  const [isSaving, setIsSaving] = useState(false);

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await updateProjectFile(
        file.id,
        { category_id: categoryId, project_step_id: projectStepId },
        user.access_token
      );
      onSaved();
    } catch (err) {
      onError("Erro ao editar o arquivo.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full mt-10 min-w-[24rem]">
      <SelectInput
        label="Categoria (opcional)"
        onChange={(option) => setCategoryId(option?.value ?? null)}
        value={
          categoryOptions.find((option) => option.value === categoryId) ?? null
        }
        options={categoryOptions}
      />
      <SelectInput
        label="Etapa do projeto (opcional)"
        onChange={(option) => setProjectStepId(option?.value ?? null)}
        value={
          stepOptions.find((option) => option.value === projectStepId) ?? null
        }
        options={stepOptions}
      />
      <button
        type="button"
        disabled={isSaving}
        onClick={handleSave}
        className="w-full bg-blue-500 py-3 rounded-lg text-gray-100 font-title tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        SALVAR
      </button>
    </div>
  );
}
