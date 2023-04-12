import * as Dialog from "@radix-ui/react-dialog";
import { XCircle } from "phosphor-react";
import { ReactNode } from "react";

interface ModalProps {
  trigger: ReactNode;
  title: ReactNode;
  description: ReactNode;
  content: ReactNode;
}

export function Modal({ trigger, title, description, content }: ModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Dialog.Overlay className="bg-gray-500 bg-opacity-30 backdrop-blur-sm fixed top-0 bottom-0 left-0 right-0 grid place-items-center">
        <Dialog.Content className="flex flex-col w-min-[440px] items-center bg-gray-100 px-28 py-16 rounded-lg shadow-lg">
          <Dialog.Title className="flex justify-between items center gap-10">
            {title}
            <Dialog.Close className="flex items-center">
              <XCircle size={30} color="#6b7280" />
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
