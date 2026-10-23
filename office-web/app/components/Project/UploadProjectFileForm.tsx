"use client";

import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextInput } from "../Form/TextInput";
import SelectInput from "../Form/SelectInput";
import Button from "../Button";
import useUser from "@/app/hooks/useUser";
import { convertBase64 } from "@/app/lib/utils";
import { Category } from "@/app/lib/api/office-api/categories/dtos";
import { createProjectFile } from "@/app/lib/api/office-api/project-files/create-project-file";

// Files travel as base64 in the JSON body; past ~380MB the API can't hold
// the string in memory (see office-api main.ts), so refuse them up front.
const MAX_FILE_BYTES = 380 * 1024 * 1024;

const uploadSchema = z.object({
  name: z.string().trim().min(1, "Dê um nome ao arquivo."),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface UploadProjectFileFormProps {
  file: File;
  project_id: string;
  categories: Category[];
  // The project's steps, as options (value = ProjectStep id)
  stepOptions: { value: string; label: string }[];
  // Pre-selected step, e.g. when the file list is filtered by a step
  defaultProjectStepId?: string | null;
  onUploaded: () => void;
  onCancel: () => void;
  // eslint-disable-next-line no-unused-vars
  onError: (message: string) => void;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function getExtension(fileName: string) {
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex > 0 ? fileName.slice(dotIndex + 1).toLowerCase() : "";
}

export default function UploadProjectFileForm({
  file,
  project_id,
  categories,
  stepOptions,
  defaultProjectStepId = null,
  onUploaded,
  onCancel,
  onError,
}: UploadProjectFileFormProps) {
  const { user } = useUser();
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [projectStepId, setProjectStepId] = useState<string | null>(
    defaultProjectStepId
  );
  // null: not sending; -1: reading the file; 0-100: upload progress
  const [progress, setProgress] = useState<number | null>(null);

  const { register, handleSubmit, formState } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: { name: file.name },
  });

  const isTooBig = file.size > MAX_FILE_BYTES;
  const isSending = progress !== null;

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const onSubmit: SubmitHandler<UploadFormData> = async ({ name }) => {
    if (!user || isTooBig) return;

    try {
      setProgress(-1);
      const encodedFile = (await convertBase64(file)) as string;

      setProgress(0);
      await createProjectFile(
        {
          project_id,
          category_id: categoryId,
          project_step_id: projectStepId,
          name: name.trim(),
          file: encodedFile,
          fileFormat: getExtension(file.name) || "bin",
        },
        user.access_token,
        setProgress
      );

      onUploaded();
    } catch (err: Error | any) {
      setProgress(null);

      if (err.message === "Project file already exists.") {
        onError("Já existe um arquivo com esse nome neste projeto.");
      } else {
        onError("Erro ao enviar o arquivo.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-gray-100 p-8 rounded-lg shadow-md flex flex-col gap-4"
    >
      <div className="flex justify-between items-center gap-4">
        <h3 className="text-lg font-semibold">Enviar arquivo</h3>
        <p className="text-sm text-gray-500">
          {file.name} · {formatBytes(file.size)}
        </p>
      </div>

      {isTooBig && (
        <p className="text-red-400 text-sm">
          Esse arquivo tem {formatBytes(file.size)}. Por enquanto o limite é de{" "}
          {formatBytes(MAX_FILE_BYTES)} por arquivo.
        </p>
      )}

      <div className="flex gap-4 items-end flex-wrap">
        <div className="flex flex-col gap-1 flex-1 min-w-[16rem]">
          <div className="flex justify-between items-center">
            <p className="font-title text-gray-500">Nome</p>
            {formState.errors.name && (
              <p className="text-red-400 text-xs">
                {formState.errors.name.message}
              </p>
            )}
          </div>
          <TextInput
            name="name"
            label="Nome"
            type="text"
            error={!!formState.errors.name}
            register={register}
            disabled={isSending}
          />
        </div>

        <div className="w-64">
          <SelectInput
            label="Categoria (opcional)"
            onChange={(option) => setCategoryId(option?.value ?? null)}
            value={
              categoryOptions.find((option) => option.value === categoryId) ??
              null
            }
            options={categoryOptions}
          />
        </div>

        <div className="w-64">
          <SelectInput
            label="Etapa (opcional)"
            onChange={(option) => setProjectStepId(option?.value ?? null)}
            value={
              stepOptions.find((option) => option.value === projectStepId) ??
              null
            }
            options={stepOptions}
          />
        </div>
      </div>

      {isSending && (
        <div className="flex flex-col gap-1">
          <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-1 bg-blue-500 transition-all"
              style={{ width: `${Math.max(progress, 0)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">
            {progress < 0 ? "Preparando o arquivo..." : `Enviando ${progress}%`}
          </p>
        </div>
      )}

      <div className="flex gap-4 justify-end">
        <Button
          text="CANCELAR"
          size="small"
          fill={false}
          type="button"
          onClick={onCancel}
          disabled={isSending}
        />
        <Button
          text="ENVIAR"
          size="small"
          type="submit"
          disabled={isSending || isTooBig}
        />
      </div>
    </form>
  );
}
