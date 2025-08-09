import { useState } from "react";
import { GameCard } from "@/components/ui/game-card";
import { GameButton } from "@/components/ui/game-button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award, RotateCcw, Eye } from "lucide-react";
import { Player } from "./SetupScreen";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ResultsScreenProps {
  players: Player[];
  onReturnToSetup: () => void;
}

export function ResultsScreen({ players, onReturnToSetup }: ResultsScreenProps) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center font-bold text-muted-foreground">{index + 1}</span>;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 1:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 2:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-game flex items-center justify-center p-6">
      <GameCard className="w-full max-w-2xl p-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8" />
            النتائج النهائية
          </CardTitle>
          <p className="text-muted-foreground">مبروك للفائزين!</p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* المركز الأول */}
          {sortedPlayers.length > 0 && (
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  البطل
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold">{sortedPlayers[0].name}</h3>
                <p className="text-lg text-muted-foreground">
                  {sortedPlayers[0].points} نقطة • {sortedPlayers[0].challengesWon} تحديات
                </p>
              </div>
            </div>
          )}

          {/* باقي المراكز */}
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.name}
                className={`flex items-center gap-4 p-4 rounded-lg ${getRankColor(index)}`}
              >
                <div className="flex items-center gap-3">
                  {getRankIcon(index)}
                  <div>
                    <h4 className="font-semibold text-lg">{player.name}</h4>
                    <p className="text-sm opacity-80">
                      {player.points} نقطة • {player.challengesWon} تحدي مفوز
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* الأزرار */}
          <div className="flex gap-4">
            <GameButton
              variant="primary"
              size="lg"
              onClick={() => setShowDetailsModal(true)}
              className="flex-1"
            >
              <Eye className="w-5 h-5 ml-2" />
              التفاصيل
            </GameButton>
            <GameButton
              variant="ghost"
              size="lg"
              onClick={onReturnToSetup}
              className="flex-1"
            >
              <RotateCcw className="w-5 h-5 ml-2" />
              لعبة جديدة
            </GameButton>
          </div>
        </CardContent>
      </GameCard>

      {/* نافذة التفاصيل */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">تفاصيل النتائج</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center font-semibold border-b pb-2">
              <span>الاسم</span>
              <span>النقاط</span>
              <span>التحديات</span>
            </div>
            {sortedPlayers.map((player, index) => (
              <div key={player.name} className="grid grid-cols-3 gap-4 text-center p-2 bg-muted rounded">
                <span className="font-medium">{player.name}</span>
                <span className="font-bold text-primary">{player.points}</span>
                <span className="text-muted-foreground">{player.challengesWon}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}