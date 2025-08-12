import { useState } from "react";
import { GameCard } from "@/components/ui/game-card";
import { GameButton } from "@/components/ui/game-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Users, Clock, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { usePWA } from "@/hooks/usePWA";
import { InstallDialog } from "@/components/ui/install-dialog";
import { useState as useDialogState } from "react";

export interface Player {
  name: string;
  points: number;
  challengesWon: number;
}

interface SetupScreenProps {
  players: Player[];
  gameTime: number;
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (index: number) => void;
  onGameTimeChange: (time: number) => void;
  onStartGame: () => void;
}

export function SetupScreen({
  players,
  gameTime,
  onAddPlayer,
  onRemovePlayer,
  onGameTimeChange,
  onStartGame,
}: SetupScreenProps) {
  const [playerName, setPlayerName] = useState("");
  const [showInstallDialog, setShowInstallDialog] = useDialogState(false);
  const { toast } = useToast();
  const { isPWA, isInstallable, installPWA } = usePWA();

  const addPlayer = () => {
    const name = playerName.trim();
    if (name) {
      if (players.some(p => p.name === name)) {
        toast({
          title: "خطأ",
          description: "هذا الاسم موجود مسبقاً!",
          variant: "destructive",
        });
        return;
      }
      onAddPlayer(name);
      setPlayerName("");
      toast({
        title: "تم!",
        description: `تم إضافة ${name} للعبة`,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addPlayer();
    }
  };

  const formatTime = (minutes: number) => {
    return minutes === 0 ? "بدون وقت" : `${minutes} دقيقة`;
  };

  const handleInstallApp = async () => {
    const success = await installPWA();
    if (success) {
      toast({
        title: "تم!",
        description: "تم تثبيت التطبيق بنجاح",
      });
    }
    setShowInstallDialog(false);
  };

  return (
    <div className="min-h-screen bg-gradient-game flex items-center justify-center p-3 sm:p-6 landscape:p-4 transition-all duration-300">
      <GameCard className="w-full max-w-2xl landscape:max-w-4xl p-4 sm:p-6 lg:p-8 landscape:p-6 animate-scale-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl landscape:text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 landscape:w-6 landscape:h-6" />
            إعداد اللعبة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 landscape:space-y-4 landscape:grid landscape:grid-cols-2 landscape:gap-6">
          {/* إضافة لاعب */}
          <div className="space-y-3 sm:space-y-4 landscape:col-span-2">
            <Label htmlFor="player-name" className="text-base sm:text-lg landscape:text-base font-semibold">
              إضافة لاعب جديد
            </Label>
            <div className="flex gap-2 sm:gap-3">
              <Input
                id="player-name"
                type="text"
                placeholder="اسم اللاعب"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-sm sm:text-base landscape:text-sm h-9 sm:h-12 landscape:h-10 transition-all focus:scale-105"
                dir="rtl"
              />
              <GameButton variant="success" size="default" className="px-3 sm:px-6 landscape:px-4 text-sm sm:text-base landscape:text-sm h-9 sm:h-12 landscape:h-10 transition-all hover:scale-105" onClick={addPlayer}>
                إضافة
              </GameButton>
            </div>
          </div>

          {/* قائمة اللاعبين */}
          {players.length > 0 && (
            <div className="space-y-2 animate-fade-in landscape:col-span-1">
              <Label className="text-base sm:text-lg landscape:text-sm font-semibold">اللاعبون ({players.length})</Label>
              <div className="space-y-1 max-h-56 sm:max-h-64 landscape:max-h-44 overflow-y-auto pr-1 landscape:pr-2">
                {players.map((player, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-1.5 sm:p-2 landscape:p-1.5 bg-muted rounded-md border transition-all hover:bg-muted/80 hover:scale-[1.02] animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="font-medium text-xs sm:text-sm landscape:text-xs truncate mr-2">{player.name}</span>
                    <GameButton
                      variant="danger"
                      size="sm"
                      onClick={() => onRemovePlayer(index)}
                      className="h-6 w-6 sm:h-7 sm:w-7 landscape:h-6 landscape:w-6 p-0 transition-all hover:scale-110 shrink-0"
                    >
                      <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 landscape:w-2.5 landscape:h-2.5" />
                    </GameButton>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* إعداد الوقت */}
          <div className="space-y-3 sm:space-y-4 landscape:col-span-1">
            <Label className="text-base sm:text-lg landscape:text-base font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 landscape:w-4 landscape:h-4" />
              مدة اللعبة: {formatTime(gameTime)}
            </Label>
            <Slider
              value={[gameTime]}
              onValueChange={(value) => onGameTimeChange(value[0])}
              max={5}
              min={0}
              step={0.5}
              className="w-full [&>*:first-child]:flex-row-reverse transition-all"
              dir="ltr"
            />
            <div className="flex justify-between text-xs sm:text-sm landscape:text-xs text-muted-foreground">
              <span>5 دقائق</span>
              <span>بدون وقت</span>
            </div>
          </div>

          {/* الأزرار */}
          <div className="space-y-3 sm:space-y-4 landscape:col-span-2">
            {/* زر تحميل التطبيق */}
            {!isPWA && (
              <GameButton
                variant="primary"
                size="default"
                onClick={() => setShowInstallDialog(true)}
                className="w-full flex items-center gap-2 h-10 sm:h-12 landscape:h-10 text-sm sm:text-base landscape:text-sm transition-all hover:scale-105"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5 landscape:w-4 landscape:h-4" />
                حفظ كتطبيق
              </GameButton>
            )}

            {/* زر البدء */}
            <GameButton
              variant="game"
              size="default"
              onClick={onStartGame}
              disabled={players.length === 0}
              className="w-full h-12 sm:h-14 landscape:h-11 text-base sm:text-lg landscape:text-base transition-all hover:scale-105 disabled:hover:scale-100"
            >
              {players.length === 0 ? "أضف لاعبين للبدء" : "بدء اللعب"}
            </GameButton>
          </div>
        </CardContent>
      </GameCard>

      {/* نافذة تعليمات التثبيت */}
      <InstallDialog
        isOpen={showInstallDialog}
        onClose={() => setShowInstallDialog(false)}
        onInstall={handleInstallApp}
      />
    </div>
  );
}