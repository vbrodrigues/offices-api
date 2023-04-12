import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TextInput } from "./TextInput";
import { Dropzone } from "./Dropzone";

const signUpSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(11),
  password: z.string().min(6).max(100),
  passwordConfirmation: z.string().min(6).max(100),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpForm = () => {
  const { register, handleSubmit, formState } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  return (
    <form className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-1">
        <p className="font-title text-gray-500">{"Nome do escritório"}</p>
        <TextInput
          name="name"
          label="Nome do escritório"
          type="text"
          error={!!formState.errors.name}
          register={register}
        />
      </div>

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
        <p className="font-title text-gray-500">{"Telefone"}</p>
        <TextInput
          name="phone"
          label="Telefone"
          type="text"
          error={!!formState.errors.phone}
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
        <p className="font-title text-gray-500">{"Confirme sua senha"}</p>
        <TextInput
          name="passwordConfirmation"
          label="Confirme sua senha"
          type="text"
          error={!!formState.errors.passwordConfirmation}
          register={register}
        />
      </div>

      <Dropzone
        label="Logomarca de sua empresa"
        description="Arraste a imagem aqui ou clique para carregar a imagem de seu computador"
      />

      <button
        type="submit"
        className="w-full bg-blue-500 py-3 rounded-lg text-gray-100 font-title tracking-wide hover:opacity-90 transition-opacity"
      >
        CADASTRAR
      </button>
    </form>
  );
};

export default SignUpForm;
