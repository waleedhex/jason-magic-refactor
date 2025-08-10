import { useState } from "react";
import { GameCard } from "@/components/ui/game-card";
import { GameButton } from "@/components/ui/game-button";
import { Input } from "@/components/ui/input";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface LoginScreenProps {
  onLogin: () => void;
  codes: string[];
}

export function LoginScreen({ onLogin, codes }: LoginScreenProps) {
  const [codeInput, setCodeInput] = useState("");
  const { toast } = useToast();

  const verifyCode = () => {
    if (codes.includes(codeInput.toLowerCase())) {
      onLogin();
    } else {
      toast({
        title: "خطأ",
        description: "رمز الدخول غير صحيح!",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      verifyCode();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-game flex items-center justify-center p-6">
      <GameCard className="w-full max-w-md p-8">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            أسرع واحد
          </CardTitle>
          <p className="text-muted-foreground text-lg">
            لعبة التحدي والمرح الجماعية
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="أدخل رمز الدخول"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-center text-lg h-12"
              dir="rtl"
            />
          </div>
          <GameButton 
            variant="game" 
            size="lg" 
            onClick={verifyCode}
            className="w-full"
          >
            دخول
          </GameButton>
        </CardContent>
      </GameCard>
      
      {/* ستيكر المتجر */}
      <div className="mt-6">
        <a 
          href="https://hex-store.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full max-w-md mx-auto"
        >
          <div className="bg-gradient-to-r from-primary to-primary-glow p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-white/20">
            <div className="text-center">
              <div className="text-white font-bold text-lg mb-1">
                🛍️ حياكم في متجرنا 🛍️
              </div>
              <div className="text-white/80 text-sm">
                اضغط للزيارة
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}