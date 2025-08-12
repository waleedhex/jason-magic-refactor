import { useState, useEffect } from "react";
import { GameCard } from "@/components/ui/game-card";
import { GameButton } from "@/components/ui/game-button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, Trophy, SkipForward, Forward } from "lucide-react";
import { Player } from "./SetupScreen";
import { WinnerDialog } from "./WinnerDialog";

export interface Order {
  text: string;
  points: number;
}

interface GameScreenProps {
  players: Player[];
  orders: Order[];
  currentOrderIndex: number;
  gameTime: number;
  totalOrders: number; // إضافة العدد الكلي
  currentOrderNumber: number; // رقم التحدي الحالي
  onSelectWinner: (playerIndex: number) => void;
  onSkipOrder: () => void;
  onNextOrder: () => void;
  onEndGame: () => void;
  onShowTimeUp: () => void;
}

export function GameScreen({
  players,
  orders,
  currentOrderIndex,
  gameTime,
  totalOrders,
  currentOrderNumber,
  onSelectWinner,
  onSkipOrder,
  onNextOrder,
  onEndGame,
  onShowTimeUp,
}: GameScreenProps) {
  const [isOrderRevealed, setIsOrderRevealed] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [timeLeft, setTimeLeft] = useState(gameTime);
  const [showWinnerSelection, setShowWinnerSelection] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const currentOrder = orders[currentOrderIndex];

  useEffect(() => {
    resetOrder();
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [currentOrderIndex]);

  const resetOrder = () => {
    setIsOrderRevealed(false);
    setShowActions(false);
    setShowWinnerSelection(false);
    setTimeLeft(gameTime);
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const revealOrder = () => {
    if (!isOrderRevealed && currentOrder) {
      setIsOrderRevealed(true);
      if (gameTime > 0) {
        startTimer();
      }
      setTimeout(() => {
        setShowActions(true);
      }, 2000);
    }
  };

  const startTimer = () => {
    let time = gameTime;
    const interval = setInterval(() => {
      time--;
      setTimeLeft(time);
      if (time <= 0) {
        clearInterval(interval);
        onShowTimeUp();
      }
    }, 1000);
    setTimerInterval(interval);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleWinnerSelect = (playerIndex: number) => {
    onSelectWinner(playerIndex);
    setShowWinnerSelection(false);
  };

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gradient-game flex items-center justify-center p-6">
        <GameCard className="w-full max-w-2xl p-8 text-center">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">انتهت التحديات!</h2>
            <GameButton variant="game" size="lg" onClick={onEndGame}>
              عرض النتائج
            </GameButton>
          </CardContent>
        </GameCard>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-game flex items-center justify-center p-4 sm:p-6 landscape:p-4 overflow-hidden">
      <GameCard className="w-full max-w-3xl landscape:max-w-6xl h-fit max-h-[90vh] landscape:max-h-[85vh] p-6 sm:p-8 landscape:p-6 transition-all duration-300 overflow-y-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl landscape:text-2xl font-bold text-primary">
            أسرع واحد
          </CardTitle>
          <p className="text-muted-foreground text-base sm:text-lg landscape:text-base">
            التحدي رقم {currentOrderNumber} من {totalOrders}
          </p>
        </CardHeader>
        <CardContent className="space-y-6 sm:space-y-8 landscape:space-y-4 landscape:grid landscape:grid-cols-2 landscape:gap-6">
          {/* عرض التحدي */}
          <GameCard 
            onClick={revealOrder}
            className="p-6 sm:p-8 landscape:p-6 text-center cursor-pointer min-h-[100px] sm:min-h-[120px] landscape:min-h-[100px] flex items-center justify-center transition-all duration-300 hover:scale-105 landscape:col-span-2"
            hover={!isOrderRevealed}
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="text-lg sm:text-2xl landscape:text-xl font-bold leading-relaxed">
                {isOrderRevealed ? currentOrder.text : "اضغط لعرض التحدي"}
              </div>
              {isOrderRevealed && (
                <div className="text-base sm:text-lg landscape:text-base text-primary font-semibold">
                  النقاط: {currentOrder.points}
                </div>
              )}
            </div>
          </GameCard>

          {/* المؤقت */}
          {gameTime > 0 && (
            <div className="text-center landscape:col-span-2">
              <div className="text-3xl sm:text-4xl landscape:text-3xl font-bold text-game-timer flex items-center justify-center gap-2">
                <Timer className="w-6 h-6 sm:w-8 sm:h-8 landscape:w-6 landscape:h-6" />
                {formatTime(timeLeft)}
              </div>
            </div>
          )}

          {/* أزرار العمل والتحكم */}
          <div className="landscape:col-span-2">
            {/* مساحة محجوزة للأزرار لمنع القفز */}
            <div className="min-h-[60px] sm:min-h-[64px] landscape:min-h-[52px] flex items-center">
              {showActions ? (
                <div className="w-full space-y-3 sm:space-y-4 landscape:space-y-0 landscape:grid landscape:grid-cols-4 landscape:gap-3 animate-fade-in">
                  <GameButton
                    variant="success"
                    size="lg"
                    onClick={() => setShowWinnerSelection(true)}
                    className="w-full h-11 sm:h-12 landscape:h-10 text-sm sm:text-base landscape:text-sm transition-all hover:scale-105"
                  >
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 landscape:w-4 landscape:h-4 ml-2" />
                    اختيار الفائز
                  </GameButton>
                  <GameButton
                    variant="warning"
                    size="lg"
                    onClick={onSkipOrder}
                    className="w-full h-11 sm:h-12 landscape:h-10 text-sm sm:text-base landscape:text-sm transition-all hover:scale-105"
                  >
                    <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 landscape:w-4 landscape:h-4 ml-2" />
                    لا يمكن تنفيذه
                  </GameButton>
                  <GameButton
                    variant="primary"
                    size="lg"
                    onClick={onNextOrder}
                    className="w-full h-11 sm:h-12 landscape:h-10 text-sm sm:text-base landscape:text-sm transition-all hover:scale-105"
                  >
                    <Forward className="w-4 h-4 sm:w-5 sm:h-5 landscape:w-4 landscape:h-4 ml-2" />
                    التالي
                  </GameButton>
                  <GameButton
                    variant="danger"
                    size="lg"
                    onClick={onEndGame}
                    className="w-full h-11 sm:h-12 landscape:h-10 text-sm sm:text-base landscape:text-sm transition-all hover:scale-105"
                  >
                    إنهاء الجولات
                  </GameButton>
                </div>
              ) : (
                <div className="w-full flex gap-3 sm:gap-4 landscape:gap-3 animate-fade-in">
                  <GameButton
                    variant="primary"
                    size="lg"
                    onClick={onNextOrder}
                    className="flex-1 h-11 sm:h-12 landscape:h-10 text-sm sm:text-base landscape:text-sm transition-all hover:scale-105"
                  >
                    <Forward className="w-4 h-4 sm:w-5 sm:h-5 landscape:w-4 landscape:h-4 ml-2" />
                    التالي
                  </GameButton>
                  <GameButton
                    variant="danger"
                    size="lg"
                    onClick={onEndGame}
                    className="flex-1 h-11 sm:h-12 landscape:h-10 text-sm sm:text-base landscape:text-sm transition-all hover:scale-105"
                  >
                    إنهاء الجولات
                  </GameButton>
                </div>
              )}
            </div>
          </div>

        </CardContent>
      </GameCard>

      <WinnerDialog
        isOpen={showWinnerSelection}
        onClose={() => setShowWinnerSelection(false)}
        players={players}
        onSelectWinner={handleWinnerSelect}
      />
    </div>
  );
}