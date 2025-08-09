import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GameCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function GameCard({ 
  children, 
  className, 
  onClick, 
  hover = true 
}: GameCardProps) {
  return (
    <Card
      className={cn(
        "bg-game-card border-border shadow-card-game transition-smooth",
        hover && "hover:bg-game-card-hover hover:shadow-lg hover:scale-[1.02] cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  );
}