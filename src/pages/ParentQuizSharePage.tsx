import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle } from 'lucide-react';

// 샘플 퀴즈 데이터 (실제 서비스에서는 서버에서 받아옴)
const QUIZ_DATA: Record<string, { question: string; options: string[] }> = {
  '1': {
    question: '가족끼리 여행 간다면, 어디로 가장 가고 싶을까요?',
    options: ['바다 🌊', '산 🏞️', '놀이공원 🎢', '해외 ✈️'],
  },
  '2': {
    question: '가족이 모이면 꼭 함께 먹는 음식은 뭐예요?',
    options: ['피자 🍕', '치킨 🍗', '스테이크 🥩', '샐러드 🥗'],
  },
  // ... 추가 퀴즈
};

export default function ParentQuizSharePage() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const quiz = QUIZ_DATA[quizId || '1'] || QUIZ_DATA['1'];

  const [nickname, setNickname] = useState('부모님');
  const [selected, setSelected] = useState('');
  const [extra, setExtra] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected) return;
    // 실제 서비스에서는 서버로 답변 전송
    localStorage.setItem(`parent-quiz-answer-${quizId}`, JSON.stringify({ nickname, selected, extra }));
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-xl">
          {!submitted ? (
            <>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg font-bold mb-2">자녀가 보낸 이구동성 퀴즈</CardTitle>
                <p className="text-sm text-muted-foreground mb-2">아래 질문에 답변해주시면 자녀가 결과를 확인할 수 있어요!</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">닉네임(선택)</label>
                  <Input
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    maxLength={10}
                    className="mb-2"
                  />
                </div>
                <div>
                  <div className="font-medium text-base mb-3">{quiz.question}</div>
                  <div className="flex flex-col gap-2 mb-3">
                    {quiz.options.map(opt => (
                      <button
                        key={opt}
                        className={`w-full px-4 py-2 rounded-lg border text-left transition-colors font-medium ${selected === opt ? 'bg-accent text-white border-accent shadow-glow' : 'bg-muted text-muted-foreground hover:bg-accent/20'}`}
                        onClick={() => setSelected(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <Input
                    value={extra}
                    onChange={e => setExtra(e.target.value)}
                    placeholder="추가로 하고 싶은 말 (선택)"
                    maxLength={50}
                  />
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!selected}
                  className="w-full mt-2"
                  variant="gradient"
                >
                  답변 제출하기
                </Button>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="text-center pb-2">
                <CheckCircle className="mx-auto mb-2 text-green-500" size={40} />
                <CardTitle className="text-lg font-bold mb-2">답변이 전달되었습니다!</CardTitle>
                <p className="text-sm text-muted-foreground mb-2">자녀가 앱에서 결과를 확인할 수 있습니다.</p>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <Button className="w-full" variant="outline" onClick={() => navigate('/')}>홈으로</Button>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
} 