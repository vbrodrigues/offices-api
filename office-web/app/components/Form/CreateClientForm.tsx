"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextInput } from "./TextInput";
import { createClient } from "@/app/lib/api/office-api/clients/create-client";
import useUser from "@/app/hooks/useUser";
import { useToast } from "@/app/hooks/useToast";
import { CornerToast } from "../Toast/Toast";

// Mirrors the API's @IsStrongPassword() defaults
const createClientSchema = z.object({
  name: z.string().min(3, "O nome deve conter pelo menos 3 caracteres."),
  email: z.string().email("E-mail inválido."),
  phone_number: z.string().optional(),
  password: z
    .string()
    .min(8, "A senha deve conter pelo menos 8 caracteres.")
    .regex(/[a-z]/, "A senha deve conter uma letra minúscula.")
    .regex(/[A-Z]/, "A senha deve conter uma letra maiúscula.")
    .regex(/[0-9]/, "A senha deve conter um número.")
    .regex(/[^a-zA-Z0-9]/, "A senha deve conter um símbolo."),
});

type CreateClientFormData = z.infer<typeof createClientSchema>;

interface CreateClientFormProps {
  onCreated?: () => void;
}

const fields: {
  name: keyof CreateClientFormData;
  label: string;
  type: string;
}[] = [
  { name: "name", label: "Nome", type: "text" },
  { name: "email", label: "E-mail", type: "email" },
  { name: "phone_number", label: "Telefone (opcional)", type: "text" },
  { name: "password", label: "Senha de acesso do cliente", type: "password" },
];

const CreateClientForm = ({ onCreated }: CreateClientFormProps) => {
  const { user } = useUser();

  const {
    showToast,
    setToastOpen,
    toastOpen,
    toastTitle,
    toastText,
    toastType,
  } = useToast();

  const { register, handleSubmit, formState, reset } =
    useForm<CreateClientFormData>({
      resolver: zodResolver(createClientSchema),
    });

  const onSubmit: SubmitHandler<CreateClientFormData> = async ({
    name,
    email,
    phone_number,
    password,
  }: CreateClientFormData) => {
    if (!user) return;

    try {
      await createClient(
        {
          office_id: user.office_id,
          name,
          email,
          password,
          phone_number: phone_number || null,
        },
        user.access_token
      );

      showToast("Sucesso!", "Cliente cadastrado com sucesso!", "success");
      reset();
      onCreated?.();
    } catch (err: Error | any) {
      if (err.message === "Client already exists.") {
        showToast("Oops!", "Já existe um cliente com esse e-mail.", "error");
      } else {
        showToast("Oops!", "Erro ao cadastrar cliente.", "error");
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

export default CreateClientForm;
