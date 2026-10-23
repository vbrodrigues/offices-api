"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextInput } from "./TextInput";
import SelectInput from "./SelectInput";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ErrorToast } from "../Toast/Toast";
import useUser from "@/app/hooks/useUser";
import * as Toast from "@radix-ui/react-toast";
import {
  EmployeeOffice,
  findOffices,
} from "@/app/lib/api/office-api/auth/find-offices";

const signInSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z
    .string()
    .min(6, "A senha deve conter no mínimo 6 caracteres.")
    .max(100, "A senha deve conter no máximo 100 caracteres."),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignInForm = () => {
  const { register, handleSubmit, formState } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const [toastOpen, setToastOpen] = useState(false);

  // Filled when the same e-mail and password are valid in more than one office
  const [offices, setOffices] = useState<EmployeeOffice[]>([]);
  const [selectedOfficeId, setSelectedOfficeId] = useState<string | null>(null);

  const router = useRouter();

  const { loginUser } = useUser();

  const login = async (email: string, password: string, office_id: string) => {
    const user = await loginUser(email, password, office_id);

    if (user) {
      router.push("/projects");
    } else {
      setToastOpen(true);
    }
  };

  const onSubmit: SubmitHandler<SignInFormData> = async ({
    email,
    password,
  }: SignInFormData) => {
    if (offices.length > 1) {
      if (selectedOfficeId) {
        await login(email, password, selectedOfficeId);
      }
      return;
    }

    const foundOffices = await findOffices({ email, password });

    if (foundOffices.length === 0) {
      setToastOpen(true);
    } else if (foundOffices.length === 1) {
      await login(email, password, foundOffices[0].id);
    } else {
      setOffices(foundOffices);
    }
  };

  // Changing the credentials means the office list may no longer apply
  const resetOffices = () => {
    setOffices([]);
    setSelectedOfficeId(null);
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
            onInput={resetOffices}
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
            onInput={resetOffices}
          />
          {formState.errors.password ? (
            <p className="text-red-400 text-xs">
              {formState.errors.password.message}
            </p>
          ) : (
            <span className="h-4"></span>
          )}
        </div>

        {offices.length > 1 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500">
              Você faz parte de mais de um escritório. Escolha em qual entrar:
            </p>
            <SelectInput
              label="Escritório"
              onChange={(option) => setSelectedOfficeId(option?.value ?? null)}
              options={offices.map((office) => ({
                value: office.id,
                label: office.name,
              }))}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={
            formState.isSubmitting || (offices.length > 1 && !selectedOfficeId)
          }
          className="w-full mt-4 bg-blue-500 py-3 rounded-lg text-gray-100 font-title tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          ENTRAR
        </button>

        <ErrorToast
          open={toastOpen}
          setOpen={setToastOpen}
          title="Oops"
          text="E-mail ou senha incorretos. Verifique os dados e tente novamente."
        />
      </form>
    </Toast.Provider>
  );
};

export default SignInForm;
