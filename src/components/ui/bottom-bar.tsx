import { cn } from "@/lib/utils";

type BottomBarProps = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  form?: string;
  className?: string;
};

export const BottomBar = ({
  label,
  onClick,
  type = "button",
  form,
  className,
}: BottomBarProps) => (
  <div className="flex flex-col items-start gap-2 px-4 pt-4 pb-6 bg-white rounded-t-2xl shadow-[0px_6px_10px_rgba(14,22,44,0.12),0px_1px_18px_rgba(14,22,44,0.12),0px_3px_5px_rgba(14,22,44,0.2)]">
    <button
      type={type}
      onClick={onClick}
      form={form}
      className={cn(
        "flex flex-col justify-center items-center w-full h-12 px-6 py-3 bg-[#FFC124] rounded-full font-bold text-white",
        className,
      )}
    >
      {label}
    </button>
  </div>
);
