import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const gameButtonVariants = cva(
  "relative overflow-hidden transition-all duration-300 transform-gpu font-semibold inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary hover:bg-primary-glow text-primary-foreground shadow-glow hover:shadow-lg hover:scale-105",
        game: "bg-gradient-game text-white shadow-game hover:shadow-xl hover:scale-105",
        success: "bg-gradient-success text-white hover:opacity-90 hover:scale-105",
        warning: "bg-game-warning text-white hover:opacity-90 hover:scale-105",
        danger: "bg-destructive text-destructive-foreground hover:opacity-90 hover:scale-105",
        ghost: "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
        card: "bg-game-card hover:bg-game-card-hover text-foreground border border-border shadow-card-game hover:shadow-lg",
      },
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-10 px-4 py-2 text-sm",
        lg: "h-14 px-8 py-4 text-lg",
        xl: "h-16 px-10 py-5 text-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface GameButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gameButtonVariants> {
  asChild?: boolean;
}

export function GameButton({ 
  className, 
  variant, 
  size, 
  children,
  ...props 
}: GameButtonProps) {
  return (
    <button
      className={cn(gameButtonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </button>
  );
}