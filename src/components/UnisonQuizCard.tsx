import { useState, useRef } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Send, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}


interface UnisonQuizCardProps {
  question: string;
  options: string[];
  onRegister: (answer: string, extra: string) => void;
  onShare: (target: 'parent' | 'friend') => void;
  onViewResult?: () => void;
  onRandomQuestion?: () => void;
  shared?: boolean;
}

export function UnisonQuizCard({ question, options, onRegister, onShare, onViewResult, onRandomQuestion, shared }: UnisonQuizCardProps) {
  const [selected, setSelected] = useState('');
  const [extra, setExtra] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareType, setShareType] = useState<'parent' | 'child' | 'friend' | null>(null);
  const [copied, setCopied] = useState(false);
  const shareLink = shareType ? `https://familyapp.com/share/${shareType}/12345` : '';
  const copyRef = useRef<HTMLInputElement>(null);

  // 등록 후 입력값 초기화 및 다음 문제로 이동
  const handleRegister = () => {
    if (!selected) return;
    onRegister(selected, extra);

    window.dataLayer?.push({
      event: 'unison_answer_question',
      selected_answer: selected,
      extra_comment: extra
    });
    setSelected('');
    setExtra('');
  };

  const handleDontKnow = () => {
    onRegister('잘 모르겠어요', '');
    setSelected('');
    setExtra('');
  };

  const handleOptionClick = (opt: string) => {
    setSelected(opt);
  };

  const handleRandomQuestion = () => {
    if (onRandomQuestion) {
      onRandomQuestion();
    }
    setSelected('');
    setExtra('');
  };

  return (
    <>
      <Card className="shadow-card border-accent/10 mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span role="img" aria-label="quiz">🎲</span>
            이구동성 퀴즈
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3 text-lg font-medium">{question}</div>
          <div className="flex flex-col gap-2 mb-3">
            {options.map(opt => (
              <button
                key={opt}
                className={`w-full px-4 py-2 rounded-lg border text-left transition-colors font-medium ${selected === opt ? 'bg-accent text-white border-accent shadow-glow' : 'bg-muted text-muted-foreground hover:bg-accent/20'}`}
                onClick={() => {
                  handleOptionClick(opt);
                }}
              >
                {opt}
              </button>
            ))}
          </div>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-accent mb-3"
            placeholder="하고 싶은 말 적어주세요"
            value={extra}
            onChange={e => setExtra(e.target.value)}
          />
          <Button variant="gradient" onClick={handleRegister} disabled={!selected} className="w-full flex items-center gap-2 mb-2">
            등록<Send className="h-4 w-4" />
          </Button>
          <div className="flex gap-2 mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDontKnow}
              className="flex-1"
            >
              잘 모르겠어요
            </Button>
          </div>
          <div className="flex gap-2 mb-2">
            <Button variant="outline" onClick={() => setShareModalOpen(true)} className="flex-1 flex items-center gap-2">
              공유하기<Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 공유 모달 */}
      <Dialog open={shareModalOpen} onOpenChange={open => { setShareModalOpen(open); setShareType(null); setCopied(false); }}>
        <DialogContent>
          <div className="font-bold text-lg mb-4 text-center">공유 대상 선택</div>
          <div className="flex flex-col gap-2 mb-4">
            <Button variant={shareType === 'parent' ? 'gradient' : 'outline'} className="w-full" onClick={() => setShareType('parent')}>
              부모님에게 이구동성 문제 풀어보게 하기!
            </Button>
            <Button variant={shareType === 'friend' ? 'gradient' : 'outline'} className="w-full" onClick={() => setShareType('friend')}>
              지인에게 '잘잇지' 서비스 공유하기
            </Button>
          </div>
          {shareType && (
            <div className="flex flex-col items-center gap-2">
              <input
                ref={copyRef}
                className="w-full border rounded px-2 py-1 text-sm bg-muted text-muted-foreground"
                value={shareLink}
                readOnly
              />
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await navigator.clipboard.writeText(shareLink);
                  setCopied(true);
                }}
                className="w-full"
              >
                {copied ? '복사는 되었는데, 전송 기능 미구현..' : '전송 기능 미구현'}
              </Button>
            </div>
          )}
          <DialogClose asChild>
            <Button variant="ghost" className="w-full mt-4">닫기</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
} 