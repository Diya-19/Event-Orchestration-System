import { ButtonHTMLAttributes, forwardRef } from "react";
type Variant = "default" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
      variant?: Variant;
      size?: Size;

}
const VARIANT: Record<Variant, string> = {
      default:     "bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent",
      outline:     "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white",
      ghost:       "border border-transparent text-gray-600 hover:bg-gray-100 bg-transparent",
      destructive: "bg-red-600 hover:bg-red-700 text-white border border-transparent",

};
const SIZE: Record<Size, string> = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-5 py-2.5 text-base",

};
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
      ({ variant = "default", size = "md", className = "", disabled, children, ...props }, ref) => (
        <button
          ref={ref}
          disabled={disabled}
          className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors
            disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-300
            ${VARIANT[variant]} ${SIZE[size]} ${className}`}
          {...props}
        >
          {children}
    </button>

  )
);
Button.displayName = "Button";
