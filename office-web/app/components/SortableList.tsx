"use client";

import { ReactNode } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";

interface SortableListProps<T extends { id: string }> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
  disabled?: boolean;
}

interface SortableRowProps {
  id: string;
  index: number;
  disabled: boolean;
  children: ReactNode;
}

function SortableRow({ id, index, disabled, children }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex gap-3 items-center rounded-lg ${
        isDragging ? "relative z-10 bg-blue-100 shadow-md" : ""
      }`}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        aria-label="Arrastar para reordenar"
        className="p-2 -m-2 text-gray-400 hover:text-blue-500 hover:cursor-grab active:cursor-grabbing touch-none disabled:opacity-30 disabled:cursor-not-allowed"
        disabled={disabled}
        {...attributes}
        {...listeners}
      >
        <MdDragIndicator size={24} />
      </button>
      <span className="flex justify-center items-center w-6 h-6 rounded-full bg-blue-100 border border-blue-300 text-xs font-bold text-blue-900 shrink-0">
        {index + 1}
      </span>
      {children}
    </li>
  );
}

// Numbered list reordered by dragging the handle (or with the keyboard:
// focus the handle, Space to pick up, arrows to move, Space to drop). Only
// the handle starts a drag (touch-none on it), so swiping the rest of a row
// still scrolls the page on phones.
export default function SortableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  disabled = false,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ol className="flex flex-col gap-2">
          {items.map((item, index) => (
            <SortableRow
              key={item.id}
              id={item.id}
              index={index}
              disabled={disabled}
            >
              {renderItem(item, index)}
            </SortableRow>
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
}
