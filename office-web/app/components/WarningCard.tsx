interface InfoCardProps {
  title: string;
  description: string;
}

export default function WarningCard({ title, description }: InfoCardProps) {
  return (
    <div className="border border-red-500 bg-red-200 text-red-900 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p>{description}</p>
    </div>
  );
}
