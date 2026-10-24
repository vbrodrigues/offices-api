import { ReactElement, ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  // Primary action of the page, usually a Modal whose trigger is an
  // <ActionLabel>. Below lg it floats above the tab bar, thumb-reachable.
  action?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({ title, action, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex justify-between items-center gap-4">
        <h1 className="font-title text-2xl">{title}</h1>
        {action && (
          <div className="fixed z-20 right-4 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] lg:static lg:z-auto">
            {action}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

interface ActionLabelProps {
  icon: ReactElement;
  label: string;
}

// Look of a primary action: a round floating button with only the icon on
// phones, the full blue button from lg up. Use it as a Modal trigger.
export function ActionLabel({ icon, label }: ActionLabelProps) {
  return (
    <span className="flex items-center justify-center gap-2 bg-blue-500 text-gray-100 font-title tracking-wide hover:opacity-90 transition-opacity w-14 h-14 rounded-full shadow-lg lg:w-auto lg:h-auto lg:py-3 lg:px-6 lg:rounded-lg lg:shadow-none">
      {icon}
      {/* Still read by screen readers when only the icon shows */}
      <span className="sr-only lg:not-sr-only">{label}</span>
    </span>
  );
}
