"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-bold tracking-wide transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
    
    const variants = {
      primary: "bg-[#E50914] hover:bg-[#b8070f] text-white shadow-[0_4px_14px_0_rgba(229,9,20,0.39)] hover:shadow-[0_6px_20px_rgba(229,9,20,0.23)] border border-transparent",
      secondary: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10",
      ghost: "bg-transparent hover:bg-white/5 text-[#A3A3A3] hover:text-white",
      outline: "bg-transparent border border-white/20 hover:border-white text-white",
      danger: "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50",
    };
    
    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-8 py-4 text-base",
      icon: "p-2 w-10 h-10",
    };
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
