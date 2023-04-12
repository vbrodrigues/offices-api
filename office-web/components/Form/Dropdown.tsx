import * as Select from "@radix-ui/react-select";
import { CaretDown } from "phosphor-react";

interface DropdownProps {
  label: string;
  options: string[];
}

export function Dropdown({ label, options }: DropdownProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-title  text-gray-500">{label}</p>
      <Select.Root>
        <Select.Trigger className="flex justify-between items-center gap-2 border border-gray-300 rounded-lg py-2 px-4 focus:outline-blue-500">
          <Select.Value placeholder="Escolha uma opção" />
          <Select.Icon>
            <CaretDown />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Viewport className="bg-gray-100 mt-16 p-4 shadow-lg rounded-lg">
              {options.map((option) => (
                <Select.Item
                  key={option}
                  value={option}
                  className="py-1 px-2 rounded-lg text-blue-900 hover:cursor-pointer hover:outline-none hover:bg-blue-200 "
                >
                  <Select.ItemText>{option}</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
