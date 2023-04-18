"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextInput } from "./TextInput";
import { Dropzone } from "./Dropzone";
import { useRouter } from "next/navigation";
import { createOffice } from "@/app/lib/api/office-api/offices/create-office";
import { login } from "@/app/lib/api/office-api/auth/login";
import { useState } from "react";
import { convertBase64 } from "@/app/lib/utils";
import { ErrorToast } from "../Toast/Toast";
import useUser from "@/app/hooks/useUser";

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, "O nome deve conter pelo menos 3 caracteres.")
      .max(100, "O nome deve conter no máximo 100 caracteres."),
    email: z.string().email("Pro favor, preencha um e-mail válido."),
    phone: z.string(),
    password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres."),
    passwordConfirmation: z.string().min(6).max(100),
  })
  .superRefine(({ passwordConfirmation, password }, ctx) => {
    console.log("super refine", passwordConfirmation, password);
    if (passwordConfirmation !== password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "As senhas não conferem.",
        path: ["passwordConfirmation"],
      });
    }
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpForm = () => {
  const { register, handleSubmit, formState, setError } =
    useForm<SignUpFormData>({
      resolver: zodResolver(signUpSchema),
    });

  const router = useRouter();

  const { setCurrentUser } = useUser();

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [logoFile, setLogoFile] = useState<string | null>();

  const onSubmit: SubmitHandler<SignUpFormData> = async ({
    name,
    email,
    password,
    phone,
    passwordConfirmation,
  }: SignUpFormData) => {
    try {
      const createOfficeResponse = await createOffice({
        name,
        owner_email: email,
        owner_password: password,
        owner_phone_number: phone,
        logo: logoFile,
      });

      console.log(createOfficeResponse);

      const loginResponse = await login({
        email,
        password,
        office_id: createOfficeResponse.id,
      });

      if (loginResponse) {
        setCurrentUser({
          access_token: loginResponse.access_token,
          email,
          office_id: createOfficeResponse.id,
        });
        router.push("/projects");
      } else {
        setToastMessage(
          "Erro ao fazer login. Tente entrar pela tela 'Já faço parte de um escritório' utilizando os dados que preencheu."
        );
        setToastOpen(true);
      }
    } catch (err: Error | any) {
      console.log(err);
      if (err.message.includes("already exists")) {
        setToastMessage("Já existe um escritório com esse e-mail.");
        setToastOpen(true);
        setError("name", {
          type: "custom",
          message: "Já existe um escritório com esse nome e e-mail.",
        });
        return;
      }
      console.log("Error creating office. Error:", err);
      setToastMessage(
        "Erro ao criar escritório. Verifique os dados e tente novamente."
      );
      setToastOpen(true);
    }
  };

  const handleDropzoneChange = async (file: File) => {
    const encodedFile = (await convertBase64(file)) as string;
    setLogoFile(encodedFile);
  };

  return (
    <form
      className="grid grid-cols-2 gap-y-8 gap-x-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-1 col-span-2">
        <div className="flex justify-between items-center">
          <p className="font-title text-gray-500">{"Nome do escritório"}</p>
        </div>
        <TextInput
          name="name"
          label="Nome do escritório"
          type="text"
          error={!!formState.errors.name}
          register={register}
        />
        {formState.errors.name ? (
          <p className="text-red-400 text-xs">
            {formState.errors.name.message}
          </p>
        ) : (
          <span className="h-4"></span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <p className="font-title text-gray-500">{"E-mail"}</p>
        </div>
        <TextInput
          name="email"
          label="E-mail"
          type="text"
          error={!!formState.errors.email}
          register={register}
        />
        {formState.errors.email ? (
          <p className="text-red-400 text-xs">
            {formState.errors.email.message}
          </p>
        ) : (
          <span className="h-4"></span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <p className="font-title text-gray-500">{"Telefone"}</p>
        </div>
        <TextInput
          name="phone"
          label="Telefone"
          type="text"
          error={!!formState.errors.phone}
          register={register}
        />
        {formState.errors.phone ? (
          <p className="text-red-400 text-xs">
            {formState.errors.phone.message}
          </p>
        ) : (
          <span className="h-4"></span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <p className="font-title text-gray-500">{"Senha"}</p>
        </div>
        <TextInput
          name="password"
          label="Senha"
          type="password"
          error={!!formState.errors.password}
          register={register}
        />
        {formState.errors.password ? (
          <p className="text-red-400 text-xs">
            {formState.errors.password.message}
          </p>
        ) : (
          <span className="h-4"></span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <p className="font-title text-gray-500">{"Confirme sua senha"}</p>
        </div>
        <TextInput
          name="passwordConfirmation"
          label="Confirme sua senha"
          type="password"
          error={!!formState.errors.passwordConfirmation}
          register={register}
        />
        {formState.errors.passwordConfirmation ? (
          <p className="text-red-400 text-xs">
            {formState.errors.passwordConfirmation.message}
          </p>
        ) : (
          <span className="h-4"></span>
        )}
      </div>

      <div className="col-span-2 w-full">
        <Dropzone
          label="Logomarca de sua empresa"
          description="Arraste a imagem aqui ou clique para carregar a imagem de seu computador"
          setFile={handleDropzoneChange}
        />
      </div>

      <button
        type="submit"
        className="col-span-2 mt-4 w-full bg-blue-500 py-3 rounded-lg text-gray-100 font-title tracking-wide hover:opacity-90 transition-opacity"
      >
        CADASTRAR
      </button>

      <ErrorToast
        open={toastOpen}
        setOpen={setToastOpen}
        title="Oops"
        text={toastMessage}
      />
    </form>
  );
};

export default SignUpForm;
