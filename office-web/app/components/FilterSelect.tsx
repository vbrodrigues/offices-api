"use client";

interface FilterSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
}

// Compact labeled select for filtering and sorting lists
export default function FilterSelect({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <label className="flex flex-col gap-1 text-sm text-gray-500 w-full sm:w-auto">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`bg-gray-100 border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-blue-500 hover:cursor-pointer min-h-[44px] w-full sm:w-auto sm:min-w-[12rem] ${
          value && value !== options[0]?.value
            ? "border-blue-500"
            : "border-gray-300"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
