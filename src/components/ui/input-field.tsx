import { cn } from "@/lib/utils";

type InputFieldProps = {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  className?: string;
};

export const InputField = ({ label, name, placeholder, defaultValue, required, className }: InputFieldProps) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={name} className="font-normal text-[14px] leading-[120%] text-[#979797]">{label}</label>
    <div className={cn(
      "flex flex-row items-center w-full h-12 px-4 gap-2 border border-[#D9D9D9] rounded-lg",
      className
    )}>
      <input
        id={name}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        className="flex-1 outline-none bg-transparent font-medium text-[16px] leading-[150%] text-[#565656]"
      />
    </div>
  </div>
);
