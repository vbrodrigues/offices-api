"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextInput } from "./TextInput";
import { updateClient } from "@/app/lib/api/office-api/clients/update-client";
import { Client } from "@/app/lib/api/office-api/clients/dtos";
import useUser from "@/app/hooks/useUser";

const editClientSchema = z.object({
  name: z.string().min(3, "O nome deve conter pelo menos 3 caracteres."),
  email: z.string().email("E-mail inválido."),
  phone_number: z.string().optional(),
});

type EditClientFormData = z.infer<typeof editClientSchema>;

interface EditClientFormProps {
  client: Client;
  onSaved: () => void;
  onError: (message: string) => void;
}

const fields: {
  name: keyof EditClientFormData;
  label: string;
  type: string;
}[] = [
  { name: "name", label: "Nome", type: "text" },
  { name: "email", label: "E-mail", type: "email" },
  { name: "phone_number", label: "Telefone (opcional)", type: "text" },
];

const EditClientForm = ({ client, onSaved, onError }: EditClientFormProps) => {
  const { user } = useUser();

  const { register, handleSubmit, formState } = useForm<EditClientFormData>({
    resolver: zodResolver(editClientSchema),
    defaultValues: {
      name: client.name,
      email: client.email,
      phone_number: client.phone_number ?? "",
    },
  });

  const onSubmit: SubmitHandler<EditClientFormData> = async ({
    name,
    email,
    phone_number,
  }: EditClientFormData) => {
    if (!user) return;

    try {
      await updateClient(
        client.id,
        { name, email, phone_number: phone_number || null },
        user.access_token
      );
      onSaved();
    } catch (err: Error | any) {
      if (err.message === "Client already exists.") {
        onError("Já existe um cliente com esse e-mail.");
      } else {
        onError("Erro ao editar cliente.");
      }
    }
  };

  return (
    <form
      className="flex flex-col flex-wrap gap-8 w-full mt-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <p className="font-title text-gray-500">{field.label}</p>
            {formState.errors[field.name] && (
              <p className="text-red-400 text-xs">
                {formState.errors[field.name]?.message}
              </p>
            )}
          </div>
          <TextInput
            name={field.name}
            label={field.label}
            type={field.type}
            error={!!formState.errors[field.name]}
            register={register}
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={formState.isSubmitting}
        className="w-full bg-blue-500 py-3 rounded-lg text-gray-100 font-title tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        SALVAR
      </button>
    </form>
  );
};

export default EditClientForm;
