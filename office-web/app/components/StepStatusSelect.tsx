"use client";

import { ProjectStep } from "@/app/lib/api/office-api/projects/dtos";

type StepStatus = ProjectStep["status"];

export const stepStatusLabels: Record<StepStatus, string> = {
  "not-started": "Não iniciada",
  "in-progress": "Em andamento",
  completed: "Concluída",
  "on-hold": "Paralisada",
};

interface StepStatusSelectProps {
  value: StepStatus;
  disabled?: boolean;
  onChange: (status: StepStatus) => void;
}

export default function StepStatusSelect({
  value,
  disabled = false,
  onChange,
}: StepStatusSelectProps) {
  return (
    <select
      aria-label="Status da etapa"
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value as StepStatus)}
      className="ml-auto bg-gray-100 border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-700 focus:outline-blue-500 hover:cursor-pointer disabled:opacity-50"
    >
      {Object.entries(stepStatusLabels).map(([status, label]) => (
        <option key={status} value={status}>
          {label}
        </option>
      ))}
    </select>
  );
}
