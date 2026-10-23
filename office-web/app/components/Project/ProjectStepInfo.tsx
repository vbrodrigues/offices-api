import { ReactNode } from "react";
import { formatDistance } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { AiFillCheckCircle } from "react-icons/ai";
import { ProjectStep } from "@/app/lib/api/office-api/projects/dtos";

interface ProjectStepInfoProps {
  step: Omit<ProjectStep, "last_updated_at"> & {
    last_updated_at: Date | null;
  };
}

const statusIcons: Record<ProjectStep["status"], ReactNode> = {
  completed: <AiFillCheckCircle className="text-green-500 text-lg" />,
  "in-progress": (
    <div className="bg-blue-200 h-4 w-4 rounded-full flex items-center justify-center">
      <div className="bg-blue-700 rounded-full h-2 w-2"></div>
    </div>
  ),
  "not-started": (
    <div className="bg-gray-200 h-4 w-4 rounded-full flex items-center justify-center">
      <div className="bg-gray-500 rounded-full h-2 w-2"></div>
    </div>
  ),
  "on-hold": (
    <div className="bg-gray-200 h-4 w-4 flex items-center justify-center">
      <div className="bg-red-300 h-2 w-2"></div>
    </div>
  ),
};

const nameColors: Record<ProjectStep["status"], string> = {
  completed: "text-green-600",
  "in-progress": "text-blue-700",
  "not-started": "text-gray-500",
  "on-hold": "text-gray-500",
};

// Status icon and step name; completed steps also show when they finished
export default function ProjectStepInfo({ step }: ProjectStepInfoProps) {
  return (
    <span className="flex gap-2 items-center">
      {statusIcons[step.status]}
      <p className={nameColors[step.status]}>{step.step.name}</p>
      {step.status === "completed" && step.last_updated_at && (
        <p className="text-sm text-gray-400">
          · concluída{" "}
          {formatDistance(step.last_updated_at, Date.now(), {
            addSuffix: true,
            locale: ptBR,
          })}
        </p>
      )}
    </span>
  );
}
