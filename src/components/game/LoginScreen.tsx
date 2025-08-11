import { useState, useEffect } from "react";
import { GameCard } from "@/components/ui/game-card";
import { GameButton } from "@/components/ui/game-button";
import { Input } from "@/components/ui/input";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { usePWA } from "@/hooks/usePWA";
import storeSticker from "@/assets/store-sticker.png";

interface LoginScreenProps {
  onLogin: () => void;
  codes: string[];
}

export function LoginScreen({ onLogin, codes }: LoginScreenProps) {
  const [codeInput, setCodeInput] = useState("");
  const { toast } = useToast();
  const { isPWA } = usePWA();

  // أوتوفيل رمز الدخول في وضع PWA
  useEffect(() => {
    if (isPWA && codes.length > 0) {
      setCodeInput(codes[0]);
    }
  }, [isPWA, codes]);

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
    <div className="min-h-screen bg-gradient-game flex flex-col items-center justify-center p-6">
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
      
      {/* ستيكر المتجر - مربع تحت لوحة الدخول */}
      <div className="mt-8">
        <a 
          href="https://hex-store.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary-glow rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer border-4 border-white/30 flex flex-col items-center justify-center relative overflow-hidden">
            {/* صورة المتجر */}
            <div className="absolute inset-2 rounded-xl overflow-hidden">
              <img 
                src={storeSticker} 
                alt="متجر Hex Store" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* تأثير لمعان */}
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-white/20 to-transparent rotate-45 transition-all duration-700 hover:translate-x-full"></div>
          </div>
        </a>
      </div>
    </div>
  );
}