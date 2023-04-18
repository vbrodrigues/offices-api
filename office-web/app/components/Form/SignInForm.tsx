"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextInput } from "./TextInput";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ErrorToast } from "../Toast/Toast";
import useUser from "@/app/hooks/useUser";
import * as Toast from "@radix-ui/react-toast";

const signInSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z
    .string()
    .min(6, "A senha deve conter no mínimo 6 caracteres.")
    .max(100, "A senha deve conter no máximo 100 caracteres."),
  office_id: z.string().uuid("ID do escritório inválido"),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignInForm = () => {
  const { register, handleSubmit, formState } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const [toastOpen, setToastOpen] = useState(false);

  const router = useRouter();

  const { loginUser } = useUser();

  const onSubmit: SubmitHandler<SignInFormData> = async ({
    email,
    password,
    office_id,
  }: SignInFormData) => {
    const user = await loginUser(email, password, office_id);

    if (user) {
      router.push("/projects");
    } else {
      setToastOpen(true);
    }
  };

  return (
    <Toast.Provider swipeDirection="right" duration={5000}>
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
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
            <p className="font-title text-gray-500">{"ID do escritório"}</p>
          </div>
          <TextInput
            name="office_id"
            label="ID do escritório"
            type="text"
            error={!!formState.errors.office_id}
            register={register}
          />
          {formState.errors.office_id ? (
            <p className="text-red-400 text-xs">
              {formState.errors.office_id.message}
            </p>
          ) : (
            <span className="h-4"></span>
          )}
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-blue-500 py-3 rounded-lg text-gray-100 font-title tracking-wide hover:opacity-90 transition-opacity"
        >
          ENTRAR
        </button>

        <ErrorToast
          open={toastOpen}
          setOpen={setToastOpen}
          title="Oops"
          text="Erro ao fazer login. Verifique os dados e tente novamente."
        />
      </form>
    </Toast.Provider>
  );
};

export default SignInForm;
