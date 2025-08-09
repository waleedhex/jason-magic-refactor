import { useState, useEffect } from "react";
import { GameCard } from "@/components/ui/game-card";
import { GameButton } from "@/components/ui/game-button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, Trophy, SkipForward, Forward } from "lucide-react";
import { Player } from "./SetupScreen";

export interface Order {
  text: string;
  points: number;
}

interface GameScreenProps {
  players: Player[];
  orders: Order[];
  currentOrderIndex: number;
  gameTime: number;
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
    <div className="min-h-screen bg-gradient-game flex items-center justify-center p-6">
      <GameCard className="w-full max-w-3xl p-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            أسرع واحد
          </CardTitle>
          <p className="text-muted-foreground">
            التحدي {currentOrderIndex + 1} من {orders.length}
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* عرض التحدي */}
          <GameCard 
            onClick={revealOrder}
            className="p-8 text-center cursor-pointer min-h-[120px] flex items-center justify-center"
            hover={!isOrderRevealed}
          >
            <div className="space-y-4">
              <div className="text-2xl font-bold">
                {isOrderRevealed ? currentOrder.text : "اضغط لعرض التحدي"}
              </div>
              {isOrderRevealed && (
                <div className="text-lg text-primary font-semibold">
                  النقاط: {currentOrder.points}
                </div>
              )}
            </div>
          </GameCard>

          {/* المؤقت */}
          {gameTime > 0 && (
            <div className="text-center">
              <div className="text-4xl font-bold text-game-timer flex items-center justify-center gap-2">
                <Timer className="w-8 h-8" />
                {formatTime(timeLeft)}
              </div>
            </div>
          )}

          {/* أزرار العمل */}
          {showActions && (
            <div className={`space-y-4 transition-opacity duration-500 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
              <div className="grid grid-cols-1 gap-4">
                <GameButton
                  variant="success"
                  size="lg"
                  onClick={() => setShowWinnerSelection(true)}
                  className="w-full"
                >
                  <Trophy className="w-5 h-5 ml-2" />
                  اختيار الفائز
                </GameButton>
                <GameButton
                  variant="warning"
                  size="lg"
                  onClick={onSkipOrder}
                  className="w-full"
                >
                  <SkipForward className="w-5 h-5 ml-2" />
                  لا يمكن تنفيذه
                </GameButton>
              </div>
            </div>
          )}

          {/* أزرار التحكم */}
          <div className="flex gap-4">
            <GameButton
              variant="primary"
              size="lg"
              onClick={onNextOrder}
              className="flex-1"
            >
              <Forward className="w-5 h-5 ml-2" />
              التالي
            </GameButton>
            <GameButton
              variant="danger"
              size="lg"
              onClick={onEndGame}
              className="flex-1"
            >
              إنهاء الجولات
            </GameButton>
          </div>

          {/* اختيار الفائز */}
          {showWinnerSelection && (
            <GameCard className="p-6">
              <h3 className="text-xl font-bold text-center mb-4">اختر الفائز</h3>
              <div className="space-y-3">
                {players.map((player, index) => (
                  <GameButton
                    key={index}
                    variant="card"
                    onClick={() => handleWinnerSelect(index)}
                    className="w-full p-4 h-auto flex justify-between"
                  >
                    <span className="font-semibold">{player.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {player.points} نقاط • {player.challengesWon} تحديات
                    </span>
                  </GameButton>
                ))}
              </div>
              <GameButton
                variant="ghost"
                onClick={() => setShowWinnerSelection(false)}
                className="w-full mt-4"
              >
                إلغاء
              </GameButton>
            </GameCard>
          )}
        </CardContent>
      </GameCard>
    </div>
  );
}