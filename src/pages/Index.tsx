import { useState, useEffect } from "react";
import { LoginScreen } from "@/components/game/LoginScreen";
import { SetupScreen, Player } from "@/components/game/SetupScreen";
import { GameScreen, Order } from "@/components/game/GameScreen";
import { ResultsScreen } from "@/components/game/ResultsScreen";
import { TimeUpModal } from "@/components/game/TimeUpModal";
import codesData from "@/data/codes.json";
import ordersData from "@/data/orders.json";

type GameState = "login" | "setup" | "playing" | "results";

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("login");
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameTime, setGameTime] = useState(2); // في الدقائق
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);

  const codes: string[] = codesData;
  const orders: Order[] = ordersData;

  const handleLogin = () => {
    setGameState("setup");
  };

  const handleAddPlayer = (name: string) => {
    setPlayers(prev => [...prev, { name, points: 0, challengesWon: 0 }]);
  };

  const handleRemovePlayer = (index: number) => {
    setPlayers(prev => prev.filter((_, i) => i !== index));
  };

  const handleGameTimeChange = (time: number) => {
    setGameTime(time);
  };

  const handleStartGame = () => {
    if (players.length > 0) {
      setCurrentOrderIndex(0);
      setGameState("playing");
    }
  };

  const handleSelectWinner = (playerIndex: number) => {
    setPlayers(prev => prev.map((player, index) => 
      index === playerIndex 
        ? { 
            ...player, 
            points: player.points + orders[currentOrderIndex].points,
            challengesWon: player.challengesWon + 1
          }
        : player
    ));
    handleNextOrder();
  };

  const handleSkipOrder = () => {
    handleNextOrder();
  };

  const handleNextOrder = () => {
    if (currentOrderIndex < orders.length - 1) {
      setCurrentOrderIndex(prev => prev + 1);
    } else {
      handleEndGame();
    }
  };

  const handleEndGame = () => {
    setGameState("results");
  };

  const handleReturnToSetup = () => {
    setPlayers([]);
    setCurrentOrderIndex(0);
    setGameTime(2);
    setGameState("setup");
  };

  const handleShowTimeUp = () => {
    setShowTimeUpModal(true);
  };

  const handleCloseTimeUp = () => {
    setShowTimeUpModal(false);
  };

  return (
    <div className="min-h-screen" dir="rtl">
      {gameState === "login" && (
        <LoginScreen onLogin={handleLogin} codes={codes} />
      )}
      
      {gameState === "setup" && (
        <SetupScreen
          players={players}
          gameTime={gameTime}
          onAddPlayer={handleAddPlayer}
          onRemovePlayer={handleRemovePlayer}
          onGameTimeChange={handleGameTimeChange}
          onStartGame={handleStartGame}
        />
      )}
      
      {gameState === "playing" && (
        <GameScreen
          players={players}
          orders={orders}
          currentOrderIndex={currentOrderIndex}
          gameTime={gameTime * 60} // تحويل إلى ثوان
          onSelectWinner={handleSelectWinner}
          onSkipOrder={handleSkipOrder}
          onNextOrder={handleNextOrder}
          onEndGame={handleEndGame}
          onShowTimeUp={handleShowTimeUp}
        />
      )}
      
      {gameState === "results" && (
        <ResultsScreen
          players={players}
          onReturnToSetup={handleReturnToSetup}
        />
      )}

      <TimeUpModal
        isOpen={showTimeUpModal}
        onClose={handleCloseTimeUp}
      />
    </div>
  );
};

export default Index;
