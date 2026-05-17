import { cn } from "@/lib/utils";

type PageShellProps = {
  children: React.ReactNode;
  bottom?: React.ReactNode;
  className?: string;
  containerClassName?: string;
};

export const PageShell = ({ children, bottom, className, containerClassName }: PageShellProps) => (
  <div className={cn("flex flex-col h-screen", containerClassName)}>
    <div className={cn("flex-1 overflow-hidden flex flex-col", className)}>{children}</div>
    {bottom && <div className="sticky bottom-0">{bottom}</div>}
  </div>
);
