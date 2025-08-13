import React, { useState, useEffect } from "react";
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

  // حفظ وتحميل رمز الدخول من localStorage
  useEffect(() => {
    const savedCode = localStorage.getItem('userLoginCode');
    if (isPWA && savedCode) {
      setCodeInput(savedCode);
    }
  }, [isPWA]);

  const verifyCode = () => {
    if (codes.includes(codeInput.toLowerCase())) {
      // حفظ الرمز في localStorage
      localStorage.setItem('userLoginCode', codeInput.toLowerCase());
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
    <div className="min-h-screen bg-gradient-game flex flex-col items-center justify-center p-4 sm:p-6 landscape:flex-row landscape:gap-8">
      <div className="landscape:flex-1 landscape:max-w-md">
        <GameCard className="w-full max-w-md mx-auto p-6 sm:p-8 animate-scale-in">
          <CardHeader className="text-center space-y-3 sm:space-y-4">
            <CardTitle className="text-3xl sm:text-4xl landscape:text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              أسرع واحد
            </CardTitle>
            <p className="text-muted-foreground text-base sm:text-lg landscape:text-sm">
              لعبة التحدي والمرح الجماعية
            </p>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 landscape:space-y-3">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="أدخل رمز الدخول"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-center text-base sm:text-lg landscape:text-sm h-10 sm:h-12 landscape:h-10 transition-all focus:scale-105"
                dir="rtl"
              />
            </div>
            <GameButton 
              variant="game" 
              size="lg" 
              onClick={verifyCode}
              className="w-full h-12 sm:h-14 landscape:h-10 text-base sm:text-lg landscape:text-sm transition-all hover:scale-105"
            >
              دخول
            </GameButton>
          </CardContent>
        </GameCard>
      </div>
      
      {/* ستيكر المتجر */}
      <div className="mt-6 sm:mt-8 landscape:flex-1 landscape:max-w-xs landscape:mt-0 text-center">
        <p className="text-white text-base sm:text-lg landscape:text-sm font-bold mb-3 sm:mb-4 landscape:mb-2 drop-shadow-lg">حياكم في متجرنا</p>
        <a 
          href="https://hex-store.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          <div className="w-28 h-28 sm:w-32 sm:h-32 landscape:w-24 landscape:h-24 mx-auto bg-gradient-to-br from-primary to-primary-glow rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer border-4 border-white/30 flex flex-col items-center justify-center relative overflow-hidden">
            {/* صورة المتجر */}
            <div className="absolute inset-2 rounded-xl overflow-hidden">
              <img 
                src={storeSticker} 
                alt="متجر Hex Store" 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
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