import { ProjectStep } from "@/app/lib/api/office-api/projects/dtos";

interface ProgressBarProps {
  steps: ProjectStep[];
}

export function getProjectProgress(steps: ProjectStep[]) {
  const completed = steps.filter((step) => step.status === "completed").length;
  const total = steps.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
}

// Width comes from inline style: Tailwind only generates classes it finds in
// the source, so a class built at runtime like `w-[40%]` never exists.
export default function ProgressBar({ steps }: ProgressBarProps) {
  const { completed, total, percentage } = getProjectProgress(steps);

  return (
    <div className="flex flex-col items-end gap-1">
      <div
        className="w-full h-1 bg-gray-300 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
      >
        <div
          className="h-1 bg-blue-500 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-400">
        {total > 0 ? `${completed}/${total} etapas` : "Sem etapas"}
      </p>
    </div>
  );
}
