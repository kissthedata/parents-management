import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  History,
  Camera,
  Calendar,
  Share,
  Gamepad2,
  MessageCircle,
  Heart,
  Clock,
  CheckCircle,
  AlertCircle,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";

interface MyData {
  id: string;
  name: string;
  lastRecordDate: string;
  recentQuestion: string;
  recentAnswer: string;
  pendingQuestions: number;
  totalQuestions: number;
  completedQuestions: number;
  progressPercentage: number;
  avatar?: string;
}

export function MyManagement() {
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);
  const [myAnswers, setMyAnswers] = useState<any[]>([]);
  
  // 빈 데이터로 시작
  const [myData, setMyData] = useState<MyData>({
    id: 'me',
    name: '나',
    lastRecordDate: '',
    recentQuestion: '',
    recentAnswer: '',
    pendingQuestions: 0,
    totalQuestions: 0,
    completedQuestions: 0,
    progressPercentage: 0,
    avatar: undefined
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '좋은 아침이에요';
    if (hour < 18) return '좋은 오후에요';
    return '좋은 저녁이에요';
  };

  const getTipMessage = () => {
    const tips = [
      '아직 답변하지 않은 질문이 있어요! 질문에 답변해보세요 :)',
      '가족과의 소중한 추억을 더 기록해보는 건 어떨까요?',
      '오늘의 질문에 답변하면 가족을 더 깊이 이해할 수 있어요!',
      '이구동성 퀴즈로 가족과 함께 즐거운 시간을 보내보세요!'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  };

  // 답변 히스토리 불러오기
  const handleShowHistory = () => {
    const questionRecords = JSON.parse(localStorage.getItem('questionRecords') || '[]');
    // parentId, selectedRole 없이 내 답변 전체
    setMyAnswers(questionRecords);
    setShowHistory(true);
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/main')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            뒤로
          </Button>
          <h1 className="text-lg font-semibold text-foreground">
            내 관리
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* 상단 인사말 영역 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-2xl p-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-2xl font-bold text-white border-4 border-white shadow-lg relative">
              {myData.avatar ? (
                <img 
                  src={myData.avatar}
                  alt={myData.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span>{myData.name}</span>
              )}
              
              {/* 사진 업로드 버튼 */}
              <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors shadow-lg">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const imageUrl = e.target?.result as string;
                        setMyData(prev => ({ ...prev, avatar: imageUrl }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <span className="text-white text-sm">📷</span>
              </label>
            </div>
            
            <h2 className="text-xl font-bold text-foreground mb-2">
              {getGreeting()}, {myData.name}님!
            </h2>
            <p className="text-muted-foreground mb-3">
              나의 소중한 답변들을 확인해보세요
            </p>
            
            {/* 오늘의 질문 알림 */}
            {myData.pendingQuestions > 0 && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <span className="text-sm text-primary font-medium">
                  오늘의 질문이 도착했어요!
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* 정보 요약 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="shadow-card border-primary/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                내 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">최근 기록일</p>
                    <p className="text-sm font-medium">{myData.lastRecordDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">오늘 질문</p>
                    <p className="text-sm font-medium">{myData.pendingQuestions}개 대기</p>
                  </div>
                </div>
              </div>

              {/* 진행률 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">답변 완료도</span>
                  <span className="text-sm font-medium text-primary">
                    {myData.progressPercentage}%
                  </span>
                </div>
                <Progress value={myData.progressPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  답변을 더 많이 기록할수록, 가족을 더 깊이 이해할 수 있어요.
                </p>
              </div>

              {/* 최근 질문 */}
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">최근 답변</p>
                <p className="text-sm font-medium mb-2">{myData.recentQuestion}</p>
                <p className="text-sm text-muted-foreground">{myData.recentAnswer}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 기능 아이콘 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-2 gap-3">
            <Card className="shadow-card border-accent/10 hover:shadow-lg transition-shadow cursor-pointer" onClick={handleShowHistory}>
              <CardContent className="p-4 text-center">
                <History className="h-8 w-8 mx-auto mb-2 text-accent" />
                <h3 className="font-semibold text-sm mb-1">답변 히스토리</h3>
                <p className="text-xs text-muted-foreground">내 답변 전체 보기</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card border-secondary/10 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/gallery')}>
              <CardContent className="p-4 text-center">
                <Camera className="h-8 w-8 mx-auto mb-2 text-secondary" />
                <h3 className="font-semibold text-sm mb-1">사진첩</h3>
                <p className="text-xs text-muted-foreground">가족 사진 저장</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card border-primary/10 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/main', { state: { activeTab: 'calendar' } })}>
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold text-sm mb-1">캘린더</h3>
                <p className="text-xs text-muted-foreground">가족 일정 관리</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card border-muted-foreground/10 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/main', { state: { activeTab: 'question' } })}>
              <CardContent className="p-4 text-center">
                <Gamepad2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <h3 className="font-semibold text-sm mb-1">이구동성</h3>
                <p className="text-xs text-muted-foreground">퀴즈 풀기</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* 하단 배너 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="shadow-card border-dashed border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-foreground mb-3">
                    {getTipMessage()}
                  </p>
                  <Button 
                    variant="gradient" 
                    size="sm"
                    className="w-full"
                    onClick={() => navigate('/main')}
                  >
                    질문하러 가기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 답변 히스토리 모달 */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>내 답변 히스토리</DialogTitle>
            <DialogDescription>내가 답변한 모든 질문과 답변을 확인할 수 있습니다.</DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto space-y-4 mt-4">
            {myAnswers.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">아직 답변한 질문이 없어요</div>
            ) : (
              myAnswers.map((record, idx) => (
                <div key={record.id || idx} className="border-b pb-3 last:border-b-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{record.date}</span>
                    <span className="text-xs text-muted-foreground">{record.type === 'daily' ? '🔮' : '🎲'}</span>
                  </div>
                  <div className="mb-1">
                    <span className="text-xs text-muted-foreground">질문</span>
                    <div className="text-sm font-medium text-foreground">{record.question}</div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">답변</span>
                    <div className="text-sm text-foreground bg-muted/30 p-2 rounded-lg">{record.answer}</div>
                  </div>
                </div>
              ))
            )}
          </div>
          <DialogClose asChild>
            <Button className="mt-4 w-full" variant="outline">닫기</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
} 