import React from "react";
import Select from "react-select";

interface SelectInputProps {
  label: string;
  options: {
    value: string | number;
    label: string;
    icon?: React.ReactNode;
  }[];
}

export default function SelectInput({ label, options }: SelectInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-title  text-gray-500">{label}</p>
      <Select
        placeholder={label}
        options={options}
        isSearchable
        isClearable
        styles={{
          control: (provided) => ({
            ...provided,
            borderRadius: "0.5rem",
            paddingTop: "0.25rem",
            paddingBottom: "0.25rem",
          }),
        }}
        formatOptionLabel={(option) => (
          <div className="flex items-center gap-2">
            {option.icon}
            <span>{option.label}</span>
          </div>
        )}
      />
    </div>
  );
}
