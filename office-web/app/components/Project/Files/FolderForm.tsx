"use client";

import { FormEvent, useState } from "react";
import SelectInput from "@/app/components/Form/SelectInput";
import { Category } from "@/app/lib/api/office-api/categories/dtos";
import { ProjectFolder } from "@/app/lib/api/office-api/project-folders/dtos";

export interface FolderFormValues {
  name: string;
  category_id: string | null;
  project_step_id: string | null;
}

interface FolderFormProps {
  // Folder being edited; missing when creating one
  folder?: ProjectFolder;
  categories: Category[];
  // The project's steps, as options (value = ProjectStep id)
  stepOptions: { value: string; label: string }[];
  // Resolves when saved; throws with a message to show otherwise
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: FolderFormValues) => Promise<void>;
}

// Name plus default tags of a folder (given to files uploaded into it)
export default function FolderForm({
  folder,
  categories,
  stepOptions,
  onSubmit,
}: FolderFormProps) {
  const [name, setName] = useState(folder?.name ?? "");
  const [categoryId, setCategoryId] = useState(folder?.category_id ?? null);
  const [projectStepId, setProjectStepId] = useState(
    folder?.project_step_id ?? null
  );
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setError("Dê um nome à pasta.");
      return;
    }
    if (/[/\\]/.test(trimmed)) {
      setError("O nome não pode ter / ou \\.");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onSubmit({
        name: trimmed,
        category_id: categoryId,
        project_step_id: projectStepId,
      });
    } catch (err: Error | any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 w-full mt-8 md:min-w-[24rem]"
    >
      <label className="flex flex-col gap-1">
        <span className="font-title text-gray-500">Nome</span>
        <input
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={255}
          className={`bg-white border rounded-lg px-4 py-3 text-base text-gray-700 focus:outline-blue-500 ${
            error ? "border-red-400" : "border-gray-300"
          }`}
        />
        {error && <span className="text-red-400 text-sm">{error}</span>}
      </label>
      <p className="text-sm text-gray-500 -mb-2">
        Arquivos enviados para esta pasta recebem estas etiquetas:
      </p>
      <SelectInput
        label="Categoria (opcional)"
        onChange={(option) => setCategoryId(option?.value ?? null)}
        value={
          categoryOptions.find((option) => option.value === categoryId) ?? null
        }
        options={categoryOptions}
      />
      <SelectInput
        label="Etapa (opcional)"
        onChange={(option) => setProjectStepId(option?.value ?? null)}
        value={
          stepOptions.find((option) => option.value === projectStepId) ?? null
        }
        options={stepOptions}
      />
      <button
        type="submit"
        disabled={isSaving}
        className="w-full bg-blue-500 py-3 rounded-lg text-gray-100 font-title tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {folder ? "SALVAR" : "CRIAR PASTA"}
      </button>
    </form>
  );
}
