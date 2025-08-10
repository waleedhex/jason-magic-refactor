import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GameButton } from "@/components/ui/game-button";
import { Trophy } from "lucide-react";
import { Player } from "./SetupScreen";

interface WinnerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  onSelectWinner: (index: number) => void;
}

export function WinnerDialog({
  isOpen,
  onClose,
  players,
  onSelectWinner,
}: WinnerDialogProps) {
  const handleWinnerSelect = (index: number) => {
    onSelectWinner(index);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            اختر الفائز
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-6">
          {players.map((player, index) => (
            <GameButton
              key={index}
              variant="card"
              onClick={() => handleWinnerSelect(index)}
              className="w-full p-4 h-auto flex justify-between hover:bg-primary/10"
            >
              <span className="font-semibold text-lg">{player.name}</span>
              <span className="text-sm text-muted-foreground">
                {player.points} نقاط • {player.challengesWon} تحديات
              </span>
            </GameButton>
          ))}
        </div>
        <GameButton
          variant="ghost"
          onClick={onClose}
          className="w-full mt-4"
        >
          إلغاء
        </GameButton>
      </DialogContent>
    </Dialog>
  );
}