import { useState, useRef } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Send, User, Baby } from 'lucide-react';
import clsx from 'clsx';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';

interface DailyQuestionCardProps {
  question: string;
  onRegister: (answer: string) => void;
  onShare: (target: 'parent' | 'child' | 'friend') => void;
  onRandomQuestion?: () => void;
}

export function DailyQuestionCard({ question, onRegister, onShare, onRandomQuestion }: DailyQuestionCardProps) {
  const [answer, setAnswer] = useState('');
  const [flipped, setFlipped] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareType, setShareType] = useState<'parent' | 'child' | 'friend' | null>(null);
  const [copied, setCopied] = useState(false);
  const shareLink = shareType ? `https://familyapp.com/share/${shareType}/12345` : '';
  const copyRef = useRef<HTMLInputElement>(null);

  const handleDontKnow = () => {
    onRegister('잘 모르겠어요');
    setAnswer('');
  };

  const handleRandomQuestion = () => {
    if (onRandomQuestion) {
      onRandomQuestion();
    }
    setAnswer('');
  };

  return (
    <div className="flex justify-center mb-4">
      <div
        className="relative w-[450px] h-44"
        style={{ perspective: '1000px' }}
      >
        {/* 카드 앞면 (타로 카드 이미지/일러스트) */}
        <div
          className={clsx(
            "absolute w-full h-full rounded-2xl shadow-card bg-gradient-to-br from-primary/30 to-background flex items-center justify-center text-4xl font-bold text-primary transition-transform duration-500",
            flipped ? "rotate-y-180 z-0" : "rotate-y-0 z-10"
          )}
          style={{ backfaceVisibility: 'hidden', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          onClick={() => !flipped && setFlipped(true)}
        >
          <span role="img" aria-label="tarot">🔮</span>
        </div>
        {/* 카드 뒷면 (질문/입력/등록/공유) */}
        <div
          className={clsx(
            "absolute w-full h-full rounded-2xl shadow-card bg-white flex flex-col items-center justify-center px-4 py-6 transition-transform duration-500",
            flipped ? "rotate-y-0 z-10" : "rotate-y-180 z-0"
          )}
          style={{ backfaceVisibility: 'hidden', transform: flipped ? 'rotateY(0deg)' : 'rotateY(180deg)' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="mb-2 text-lg font-semibold text-center text-foreground">{question}</div>
          <div className="flex w-full gap-2 mb-2">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="답변을 입력하세요"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onClick={e => e.stopPropagation()}
            />
            <Button
              variant="gradient"
              onClick={e => { e.stopPropagation(); onRegister(answer); }}
              disabled={!answer}
              className="flex-shrink-0 px-4"
            >
              등록 &gt;
            </Button>
          </div>
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={e => { e.stopPropagation(); handleDontKnow(); }}
              className="flex-1"
            >
              잘 모르겠어요
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={e => { e.stopPropagation(); handleRandomQuestion(); }}
              className="flex-1"
            >
              다른 질문
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 