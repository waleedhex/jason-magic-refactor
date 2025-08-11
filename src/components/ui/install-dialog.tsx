import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GameButton } from "@/components/ui/game-button";
import { Smartphone, Monitor, Chrome, Globe } from "lucide-react";

interface InstallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
}

export function InstallDialog({ isOpen, onClose, onInstall }: InstallDialogProps) {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-primary flex items-center justify-center gap-2">
            <Smartphone className="w-6 h-6" />
            حفظ التطبيق
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            احفظ اللعبة على جهازك للوصول السريع
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* تعليمات للمتصفحات العادية */}
          {!isIOS && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Chrome className="w-6 h-6 text-primary" />
                <div className="space-y-1">
                  <p className="font-semibold">Chrome / Edge</p>
                  <p className="text-sm text-muted-foreground">اضغط على زر "تثبيت" أدناه</p>
                </div>
              </div>
              
              <GameButton 
                variant="game" 
                size="lg" 
                onClick={onInstall}
                className="w-full"
              >
                تثبيت التطبيق
              </GameButton>
            </div>
          )}

          {/* تعليمات iOS */}
          {isIOS && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Globe className="w-6 h-6 text-primary" />
                <div className="space-y-1">
                  <p className="font-semibold">Safari (iOS)</p>
                  <p className="text-sm text-muted-foreground">اتبع الخطوات التالية:</p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                  <p>اضغط على زر "مشاركة" 📤 في أسفل الشاشة</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                  <p>اختر "إضافة إلى الشاشة الرئيسية" ➕</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                  <p>اضغط "إضافة" لحفظ التطبيق</p>
                </div>
              </div>
            </div>
          )}

          {/* تعليمات عامة */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
              <Monitor className="w-5 h-5 text-primary" />
              <p className="text-sm font-medium">مميزات التطبيق المحفوظ:</p>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground pr-4">
              <li>• فتح سريع بدون متصفح</li>
              <li>• تجربة أفضل وأسرع</li>
              <li>• يعمل حتى بدون إنترنت</li>
              <li>• أيقونة على الشاشة الرئيسية</li>
            </ul>
          </div>

          <GameButton 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="w-full"
          >
            إغلاق
          </GameButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}