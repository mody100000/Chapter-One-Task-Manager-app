import type { ComponentType, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  icon?: ComponentType<{ className?: string }>;
  iconPosition?: "left" | "right";
  loading?: boolean;
};

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[#7C3AED] text-white border border-[#7C3AED] hover:bg-[#6D28D9] hover:border-[#6D28D9] active:bg-[#5B21B6]",
  outline:
    "bg-white text-zinc-700 border border-[#E4E4E7] hover:bg-zinc-50 hover:border-zinc-300 active:bg-zinc-100",
  danger:
    "bg-white text-red-600 border border-[#E4E4E7] hover:bg-red-50 hover:border-red-200 active:bg-red-100",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-9 px-4 text-sm gap-2 rounded-lg",
  lg: "h-9 px-5 text-sm gap-2.5 rounded-lg",
};

const iconSizeStyles: Record<Size, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-4.5 w-4.5",
};

export default function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-150 ease-in-out
        cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2
        disabled:pointer-events-none disabled:opacity-50
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Spinner className={iconSizeStyles[size]} variant={variant} />
          {children && <span>{children}</span>}
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && (
            <Icon className={iconSizeStyles[size]} />
          )}
          {children && <span>{children}</span>}
          {Icon && iconPosition === "right" && (
            <Icon className={iconSizeStyles[size]} />
          )}
        </>
      )}
    </button>
  );
}

// ── Icon-only button (no label) ──────────────────────────────────────────────
type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  icon: ComponentType<{ className?: string }>;
  label: string; // for accessibility
};

const iconOnlySizeStyles: Record<Size, string> = {
  sm: "h-8 w-8 rounded-lg",
  md: "h-9 w-9 rounded-xl",
  lg: "h-11 w-11 rounded-xl",
};

export function IconButton({
  variant = "outline",
  size = "md",
  icon: Icon,
  label,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`
        inline-flex items-center justify-center
        transition-all duration-150 ease-in-out
        cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2
        disabled:pointer-events-none disabled:opacity-50
        ${variantStyles[variant]}
        ${iconOnlySizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      <Icon className={iconSizeStyles[size]} />
    </button>
  );
}

// Internal spinner
function Spinner({
  className,
  variant,
}: {
  className: string;
  variant: Variant;
}) {
  const color = variant === "primary" ? "text-white/40" : "text-zinc-300";
  const spinColor = variant === "primary" ? "border-white" : "border-zinc-600";

  return (
    <span
      className={`animate-spin rounded-full border-2 border-t-transparent ${color} ${spinColor} ${className}`}
    />
  );
}
