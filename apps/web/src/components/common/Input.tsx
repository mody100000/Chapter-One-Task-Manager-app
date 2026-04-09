import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type BaseProps = {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
};

type InputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    as?: "input";
  };

type TextareaProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    as: "textarea";
  };

type Props = InputProps | TextareaProps;

export default function Input({
  label,
  required = false,
  error,
  className = "",
  as = "input",
  ...props
}: Props) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-medium text-zinc-700">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </span>

      {as === "textarea" ? (
        <textarea
          {...(props as TextareaProps)}
          className="min-h-22 rounded-lg border border-[#E4E4E7] bg-white px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-[#7C3AED] focus:outline-none"
        />
      ) : (
        <input
          {...(props as InputProps)}
          className="h-10 rounded-lg border border-[#E4E4E7] bg-white px-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-[#7C3AED] focus:outline-none"
        />
      )}

      {error ? <span className="text-xs text-red-500">{error}</span> : null}
    </label>
  );
}
