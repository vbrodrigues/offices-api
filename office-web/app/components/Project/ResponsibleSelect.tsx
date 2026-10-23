"use client";

import * as Select from "@radix-ui/react-select";
import { CaretDown, UserCircle } from "@phosphor-icons/react";
import AvatarCircle from "../AvatarCircle";

interface Person {
  id: string;
  name: string;
  avatar?: string | null;
}

interface ResponsibleSelectProps {
  responsible?: Person | null;
  employees: Person[];
  disabled?: boolean;
  // eslint-disable-next-line no-unused-vars
  onChange: (employee_id: string | null) => void;
}

// Radix Select doesn't allow empty values
const NO_RESPONSIBLE = "none";

// Shows the step's responsible (avatar + name) and lets the user change it
export default function ResponsibleSelect({
  responsible,
  employees,
  disabled = false,
  onChange,
}: ResponsibleSelectProps) {
  return (
    <Select.Root
      value={responsible?.id ?? NO_RESPONSIBLE}
      disabled={disabled}
      onValueChange={(value) =>
        onChange(value === NO_RESPONSIBLE ? null : value)
      }
    >
      <Select.Trigger
        aria-label="Responsável pela etapa"
        className="flex gap-2 items-center rounded-full px-2 py-1 text-sm hover:bg-gray-200 focus:outline-blue-500 disabled:opacity-50 data-[placeholder]:text-gray-400"
      >
        {responsible ? (
          <>
            <AvatarCircle
              name={responsible.name}
              image={responsible.avatar}
              size="small"
            />
            <span className="text-gray-700">{responsible.name}</span>
          </>
        ) : (
          <>
            <UserCircle size={24} className="text-gray-400" />
            <span className="text-gray-400">Sem responsável</span>
          </>
        )}
        <Select.Icon className="text-gray-400">
          <CaretDown size={12} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={4}
          className="z-50 bg-gray-100 p-2 shadow-lg rounded-lg border border-gray-300"
        >
          <Select.Viewport>
            <Select.Item
              value={NO_RESPONSIBLE}
              className="flex gap-2 items-center py-1 px-2 rounded-lg text-gray-500 outline-none hover:cursor-pointer data-[highlighted]:bg-blue-200"
            >
              <UserCircle size={24} className="text-gray-400" />
              <Select.ItemText>Sem responsável</Select.ItemText>
            </Select.Item>
            {employees.map((employee) => (
              <Select.Item
                key={employee.id}
                value={employee.id}
                className="flex gap-2 items-center py-1 px-2 rounded-lg text-blue-900 outline-none hover:cursor-pointer data-[highlighted]:bg-blue-200"
              >
                <AvatarCircle
                  name={employee.name}
                  image={employee.avatar}
                  size="small"
                />
                <Select.ItemText>{employee.name}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
