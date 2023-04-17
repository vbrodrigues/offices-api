export default function UnauthorizedPage() {
  return (
    <div className="flex justify-center items-center">
      <div className="flex gap-3">
        <strong className="text-gray-800">Acesso não autorizado</strong>
        <p className="text-gray-400"> | </p>
        <p className="text-gray-600">Por favor, realize o login.</p>
      </div>
    </div>
  );
}
