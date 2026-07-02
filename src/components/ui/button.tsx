import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-orange-500 text-white shadow-card hover:bg-orange-600 hover:shadow-card-hover",
        secondary: "bg-navy-900 text-white hover:bg-navy-800",
        outline: "border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white",
        outlineLight: "border border-white/30 text-white hover:bg-white/10",
        ghost: "text-navy-800 hover:text-orange-600",
      },
      size: {
        default: "px-7 py-3.5",
        sm: "px-5 py-2.5 text-xs",
        lg: "px-9 py-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
