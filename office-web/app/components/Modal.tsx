"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { MdClose } from "react-icons/md";
import { ReactNode } from "react";

interface ModalProps {
  // Leave out for a modal opened only through `open`
  trigger?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  content: ReactNode;
  // Optional: control the modal from outside (e.g. close it after a submit)
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Modal({
  trigger,
  title,
  description,
  content,
  open,
  onOpenChange,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger>{trigger}</Dialog.Trigger>}
      {/* A bottom sheet on phones, a centered dialog from md up */}
      <Dialog.Overlay className="bg-gray-500 bg-opacity-30 backdrop-blur-sm fixed inset-0 z-40 flex items-end justify-center md:items-center">
        <Dialog.Content className="flex flex-col items-center bg-gray-100 shadow-lg w-full max-h-[90dvh] overflow-y-auto rounded-t-2xl px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:w-auto md:min-w-[440px] md:max-w-[min(90vw,44rem)] md:rounded-lg md:px-12 md:py-10">
          <Dialog.Title className="flex justify-between items-start gap-6 w-full">
            {title}
            <Dialog.Close
              className="flex items-center shrink-0 p-1 -m-1"
              aria-label="Fechar"
            >
              <MdClose size={30} color="#6b7280" />
            </Dialog.Close>
          </Dialog.Title>
          <Dialog.Description className="text-gray-400 mt-4">
            {description}
          </Dialog.Description>

          {content}
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Root>
  );
}
