"use client";

import { MdClose } from "react-icons/md";

interface RoundedLabelProps {
  key?: any;
  label: string;
  isDeleteable: boolean;
  onDelete?: () => void;
}

const RoundedLabel = ({
  key,
  label,
  isDeleteable,
  onDelete,
}: RoundedLabelProps) => {
  return (
    <div
      key={key}
      className="flex gap-2 justify-center items-center border border-blue-500 bg-blue-100 rounded-full px-4 py-2 text-blue-900"
    >
      {isDeleteable && (
        <div className="hover:cursor-pointer" onClick={onDelete}>
          <MdClose color="rgb(30 58 138)" size={20} />
        </div>
      )}
      {label}
    </div>
  );
};

export default RoundedLabel;
