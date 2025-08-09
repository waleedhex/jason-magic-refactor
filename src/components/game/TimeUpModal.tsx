import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GameButton } from "@/components/ui/game-button";
import { AlertTriangle } from "lucide-react";

interface TimeUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TimeUpModal({ isOpen, onClose }: TimeUpModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-2xl text-destructive">
            <AlertTriangle className="w-8 h-8" />
            انتهى الوقت!
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <p className="text-lg text-muted-foreground">
            انتهت المدة المحددة للتحدي
          </p>
          <GameButton variant="primary" onClick={onClose} className="w-full">
            متابعة اللعب
          </GameButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}