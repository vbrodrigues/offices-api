import { ImBlocked } from "react-icons/im";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-full">
      <ImBlocked size={36} />
      <div className="flex gap-3">
        <strong className="text-gray-800">Acesso não autorizado</strong>
        <p className="text-gray-400"> | </p>
        <p className="text-gray-600">Por favor, realize o login.</p>
      </div>
    </div>
  );
}
