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
  const [usedOrders, setUsedOrders] = useState<number[]>([]);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [currentOrderNumber, setCurrentOrderNumber] = useState(1);

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
      // إعادة تعيين التحديات المتاحة والمستخدمة
      setUsedOrders([]);
      const shuffledOrders = [...orders];
      setAvailableOrders(shuffledOrders);
      // اختيار أول أمر عشوائي
      const randomIndex = Math.floor(Math.random() * shuffledOrders.length);
      setCurrentOrderIndex(randomIndex);
      setCurrentOrderNumber(1);
      setGameState("playing");
    }
  };

  const handleSelectWinner = (playerIndex: number) => {
    const currentOrder = availableOrders[currentOrderIndex];
    setPlayers(prev => prev.map((player, index) => 
      index === playerIndex 
        ? { 
            ...player, 
            points: player.points + currentOrder.points,
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
    // إضافة التحدي الحالي للمستخدمة
    const currentOrder = availableOrders[currentOrderIndex];
    const currentOrderId = orders.findIndex(order => order.text === currentOrder.text);
    
    const newUsedOrders = [...usedOrders, currentOrderId];
    setUsedOrders(newUsedOrders);
    
    // إزالة التحدي من المتاحة
    const newAvailableOrders = availableOrders.filter((_, index) => index !== currentOrderIndex);
    
    // إذا انتهت التحديات، أعد تعيينها واخلط الترتيب
    if (newAvailableOrders.length === 0) {
      const reshuffledOrders = [...orders];
      setAvailableOrders(reshuffledOrders);
      setUsedOrders([]);
      const randomIndex = Math.floor(Math.random() * reshuffledOrders.length);
      setCurrentOrderIndex(randomIndex);
      setCurrentOrderNumber(1);
    } else {
      setAvailableOrders(newAvailableOrders);
      // اختر تحدي عشوائي من المتاحة
      const randomIndex = Math.floor(Math.random() * newAvailableOrders.length);
      setCurrentOrderIndex(randomIndex);
      setCurrentOrderNumber(prev => prev + 1);
    }
  };

  const handleEndGame = () => {
    setGameState("results");
  };

  const handleReturnToSetup = () => {
    setPlayers([]);
    setCurrentOrderIndex(0);
    setUsedOrders([]);
    setAvailableOrders([]);
    setCurrentOrderNumber(1);
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
      
      {gameState === "playing" && availableOrders.length > 0 && (
        <GameScreen
          players={players}
          orders={availableOrders}
          currentOrderIndex={currentOrderIndex}
          totalOrders={orders.length}
          currentOrderNumber={currentOrderNumber}
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
