"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextInput } from "./TextInput";
import { login } from "@/lib/api/office-api/login";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

  const onSubmit: SubmitHandler<SignInFormData> = async ({
    email,
    password,
    office_id,
  }: SignInFormData) => {
    const loginResponse = await login({ email, password, office_id });

    if (loginResponse) {
      localStorage.setItem("access_token", loginResponse.access_token);
      router.push("/projects");
    } else {
      alert("Erro ao fazer login. Verifique os dados e tente novamente.");
    }
  };

  return (
    <form
      className="flex flex-col gap-8 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <p className="font-title text-gray-500">{"E-mail"}</p>
          {formState.errors.email && (
            <p className="text-red-400 text-xs">
              {formState.errors.email.message}
            </p>
          )}
        </div>
        <TextInput
          name="email"
          label="E-mail"
          type="text"
          error={!!formState.errors.email}
          register={register}
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <p className="font-title text-gray-500">{"Senha"}</p>
          {formState.errors.password && (
            <p className="text-red-400 text-xs">
              {formState.errors.password.message}
            </p>
          )}
        </div>
        <TextInput
          name="password"
          label="Senha"
          type="password"
          error={!!formState.errors.password}
          register={register}
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <p className="font-title text-gray-500">{"ID do escritório"}</p>
          {formState.errors.office_id && (
            <p className="text-red-400 text-xs">
              {formState.errors.office_id.message}
            </p>
          )}
        </div>
        <TextInput
          name="office_id"
          label="ID do escritório"
          type="text"
          error={!!formState.errors.office_id}
          register={register}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 py-3 rounded-lg text-gray-100 font-title tracking-wide hover:opacity-90 transition-opacity"
      >
        ENTRAR
      </button>
    </form>
  );
};

export default SignInForm;
