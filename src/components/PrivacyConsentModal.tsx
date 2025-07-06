import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Info, Check } from 'lucide-react';

interface PrivacyConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function PrivacyConsentModal({
  isOpen,
  onAccept,
  onDecline,
}: PrivacyConsentModalProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleAccept = () => {
    if (!isChecked) {
      setIsChecked(true); // UX 개선: 자동 체크
      return;
    }
    onAccept();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
          >
            <Card className="flex-1 w-full max-h-full flex flex-col overflow-hidden">
              <CardHeader className="text-center pb-4 flex-shrink-0">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                  개인정보 수집 및 분석 동의
                </CardTitle>
                <p className="text-sm font-semibold text-primary mt-1">
                  ✅ 서비스 개선을 위해 익명 데이터를 수집해요
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  서비스 경험 향상을 위한 데이터 수집 안내입니다.
                </p>
              </CardHeader>
              <CardContent className="space-y-6 overflow-y-auto flex-1 p-6">
                {/* 설명 텍스트 */}
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <p className="text-sm text-foreground leading-relaxed">
                    저희는 Google Analytics 4(GA4)를 활용해 사용자의 서비스 이용 데이터를 분석합니다.
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    이 데이터는 개인 식별이 불가능하도록 익명 처리되며, 서비스 품질 개선을 위한 목적으로만 활용됩니다.
                  </p>
                </div>
                {/* 수집 정보 목록 */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    동의 시 수집되는 정보는 아래와 같습니다:
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      방문한 페이지 및 체류 시간
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      클릭, 이동 등 앱 사용 행동 데이터
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      접속 기기 및 브라우저 정보
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      유입 경로 (검색, SNS, 공유 링크 등)
                    </li>
                  </ul>
                  <p className="text-xs italic text-muted-foreground">
                    예: 어떤 질문을 자주 건너뛰는지, 어떤 화면에 오래 머무는지를 분석해요.
                  </p>
                </div>
                {/* 주의사항 */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-800 leading-relaxed">
                      ※ 수집된 데이터는 Google 서버로 전송될 수 있으며, 언제든 설정에서 동의를 철회하실 수 있습니다.
                    </p>
                  </div>
                </div>
                {/* 동의 체크박스 */}
                <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                  <Checkbox
                    id="privacy-consent"
                    checked={isChecked}
                    onCheckedChange={(checked) => setIsChecked(checked as boolean)}
                    className="mt-0.5"
                  />
                  <label 
                    htmlFor="privacy-consent" 
                    className="text-sm text-foreground leading-relaxed cursor-pointer"
                  >
                    위 내용을 모두 읽고 이해했으며, 개인정보 수집 및 분석에 동의합니다.
                  </label>
                </div>
              </CardContent>
              {/* 고정된 버튼 영역 */}
              <div className="p-6 pt-0 border-t bg-background flex-shrink-0">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onDecline}
                    className="flex-1"
                  >
                    거부
                  </Button>
                  <Button
                    onClick={handleAccept}
                    disabled={!isChecked}
                    className="flex-1"
                    variant="gradient"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    동의
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}