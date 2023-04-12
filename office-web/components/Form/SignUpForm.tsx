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
  const { register, handleSubmit } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  return (
    <form className="flex flex-col gap-8 w-full">
      <TextInput label="Nome" type="text" />
      <TextInput label="E-mail" type="text" />
      <TextInput label="Telefone" type="text" />
      <TextInput label="Senha" type="password" />
      <TextInput label="Confirme sua senha" type="password" />
      <Dropzone
        label="Logo de sua empresa"
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
