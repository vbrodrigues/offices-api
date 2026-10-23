"use client";

import { useState } from "react";
import { MdChevronRight, MdFolder, MdHome } from "react-icons/md";
import { ProjectFolder } from "@/app/lib/api/office-api/project-folders/dtos";
import { childFolders } from "./folder-tree";

interface MoveFormProps {
  folders: ProjectFolder[];
  // Where the items are now (can't be the destination); undefined = mixed
  currentFolderId?: string | null;
  // Folders that can't be picked (a moved folder and its subfolders)
  blockedIds?: Set<string>;
  // eslint-disable-next-line no-unused-vars
  onMove: (folder_id: string | null) => Promise<void>;
}

// Folder tree to pick where to move files or a folder to
export default function MoveForm({
  folders,
  currentFolderId,
  blockedIds = new Set(),
  onMove,
}: MoveFormProps) {
  const [target, setTarget] = useState<string | null | undefined>(undefined);
  const [isMoving, setIsMoving] = useState(false);

  const renderLevel = (parent_id: string | null, depth: number) =>
    childFolders(folders, parent_id)
      .filter((folder) => !blockedIds.has(folder.id))
      .map((folder) => (
        <div key={folder.id}>
          <button
            type="button"
            onClick={() => setTarget(folder.id)}
            disabled={folder.id === currentFolderId}
            style={{ paddingLeft: `${0.75 + depth * 1.25}rem` }}
            className={`w-full flex items-center gap-2 py-3 pr-3 rounded-lg text-left disabled:opacity-40 ${
              target === folder.id
                ? "bg-blue-100 text-blue-900"
                : "hover:bg-gray-200"
            }`}
          >
            <MdChevronRight className="text-gray-400 shrink-0" />
            <MdFolder size={20} className="text-blue-400 shrink-0" />
            <span className="truncate">{folder.name}</span>
          </button>
          {renderLevel(folder.id, depth + 1)}
        </div>
      ));

  const handleMove = async () => {
    if (target === undefined) return;
    setIsMoving(true);
    try {
      await onMove(target);
    } finally {
      setIsMoving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full mt-8 md:min-w-[26rem]">
      <div className="flex flex-col max-h-[45dvh] overflow-y-auto border border-gray-300 rounded-lg bg-white p-1">
        <button
          type="button"
          onClick={() => setTarget(null)}
          disabled={currentFolderId === null}
          className={`w-full flex items-center gap-2 p-3 rounded-lg text-left disabled:opacity-40 ${
            target === null ? "bg-blue-100 text-blue-900" : "hover:bg-gray-200"
          }`}
        >
          <MdHome size={20} className="text-gray-500 shrink-0" />
          Raiz do projeto
        </button>
        {renderLevel(null, 1)}
      </div>
      <button
        type="button"
        disabled={target === undefined || isMoving}
        onClick={handleMove}
        className="w-full bg-blue-500 py-3 rounded-lg text-gray-100 font-title tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        MOVER PARA CÁ
      </button>
    </div>
  );
}
