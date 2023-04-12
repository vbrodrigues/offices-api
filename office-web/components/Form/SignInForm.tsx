import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextInput } from "./TextInput";
import { OfficeAPI } from "@/lib/api/office-api";

const signInSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z
    .string()
    .min(6, "Senha muito curta.")
    .max(100, "Senha muito longa"),
  office_id: z.string().uuid("ID do escritório inválido"),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignInForm = () => {
  const { register, handleSubmit, formState } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<SignInFormData> = async ({
    email,
    password,
    office_id,
  }: SignInFormData) => {
    const response = await OfficeAPI.post("/clients-auth/login", {
      email,
      password,
      office_id,
    });

    console.log(response);
  };

  return (
    <form
      className="flex flex-col gap-8 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-1">
        <p className="font-title text-gray-500">{"E-mail"}</p>
        <TextInput
          name="email"
          label="E-mail"
          type="text"
          error={!!formState.errors.email}
          register={register}
        />
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-title text-gray-500">{"Senha"}</p>
        <TextInput
          name="password"
          label="Senha"
          type="password"
          error={!!formState.errors.password}
          register={register}
        />
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-title text-gray-500">{"ID do escritório"}</p>
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
