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
  AlertCircle
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";

interface ParentData {
  id: string;
  name: string;
  role: 'mother' | 'father' | 'grandmother' | 'grandfather';
  lastRecordDate: string;
  recentQuestion: string;
  recentAnswer: string;
  pendingQuestions: number;
  totalQuestions: number;
  completedQuestions: number;
  progressPercentage: number;
  avatar?: string;
}

export function ParentManagement() {
  const { parentId } = useParams<{ parentId: string }>();
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);
  const [parentAnswers, setParentAnswers] = useState<any[]>([]);
  
  // 빈 데이터로 시작
  const [parentData, setParentData] = useState<ParentData>({
    id: parentId || '',
    name: '',
    role: 'mother',
    lastRecordDate: '',
    recentQuestion: '',
    recentAnswer: '',
    pendingQuestions: 0,
    totalQuestions: 0,
    completedQuestions: 0,
    progressPercentage: 0,
    avatar: undefined
  });

  // familyMembers에서 parentId로 멤버 찾기
  useEffect(() => {
    const saved = localStorage.getItem('familyMembers');
    if (saved && parentId) {
      const members = JSON.parse(saved);
      const found = members.find((m: any) => m.id === parentId);
      if (found) {
        // name을 기준으로 role 매핑 (더 구체적인 매칭을 먼저)
        let role: ParentData['role'] = 'mother';
        if (found.name.includes('할아버지')) role = 'grandfather';
        else if (found.name.includes('할머니')) role = 'grandmother';
        else if (found.name.includes('어머니')) role = 'mother';
        else if (found.name.includes('아버지')) role = 'father';
        
        // 질문 기록에서 해당 부모님의 답변 수 계산
        const questionRecords = JSON.parse(localStorage.getItem('questionRecords') || '[]');
        const parentAnswers = questionRecords.filter((record: any) => record.parentId === parentId);
        
        setParentData(prev => ({
          ...prev,
          id: found.id,
          name: found.name,
          role,
          avatar: found.avatar,
          completedQuestions: parentAnswers.length,
          totalQuestions: parentAnswers.length,
          lastRecordDate: parentAnswers.length > 0 ? parentAnswers[0].date : '아직 없음',
          recentQuestion: parentAnswers.length > 0 ? parentAnswers[0].question : '아직 질문한 적이 없어요',
          recentAnswer: parentAnswers.length > 0 ? parentAnswers[0].answer : '답변을 기다리고 있어요'
        }));
      }
    }
  }, [parentId]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '좋은 아침이에요';
    if (hour < 18) return '좋은 오후에요';
    return '좋은 저녁이에요';
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'mother': return '어머님';
      case 'father': return '아버님';
      case 'grandmother': return '할머님';
      case 'grandfather': return '할아버님';
      default: return '부모님';
    }
  };

  const getTipMessage = () => {
    const roleTips = {
      mother: [
        '어머님이 좋아하는 음식은 알고 계신가요? 더 답변해보세요!',
        '어머님이 좋아하는 색깔에 대해 더 알아보고 싶으시다면 답변해보세요!',
        '어머님이 즐겨 보셨던 영화가 있다면요? 답변해보세요!'
      ],
      father: [
        '아버님의 취미에 대해 더 알아보고 싶으시다면 답변해보세요!',
        '아버님이 자랑스러워했던 일이 있다면요? 답변해보세요!',
        '아버님의 바람 중 하나, 떠오르는 게 있나요? 답변해보세요!'
      ],
      grandmother: [
        '할머님의 어린 시절 이야기를 들어보는 건 어떨까요? 답변해보세요!',
        '할머님이 자주 만들어주시던 요리, 뭐가 떠오르세요? 답변해보세요!',
        '할머님이 좋아하시는 꽃, 기억나시나요? 답변해보세요!'
      ],
      grandfather: [
        '할아버지의 인생 경험담을 기록해보세요! 답변해보세요!',
        '할아버지가 눈물을 보이셨던 일이 있다면요? 답변해보세요!',
        '할아버지의 희망이나 바람, 들어보고 싶으시나요? 답변해보세요!'
      ]
    };
    
    const tips = roleTips[parentData.role] || roleTips.mother;
    return tips[Math.floor(Math.random() * tips.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            뒤로
          </Button>
          <h1 className="text-lg font-semibold text-foreground">
            {getRoleDisplayName(parentData.role)} 관리
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
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full flex items-center justify-center text-2xl font-bold text-accent border-4 border-white shadow-lg relative">
              {parentData.avatar ? (
                <img 
                  src={parentData.avatar}
                  alt={parentData.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span>{parentData.name.charAt(0)}</span>
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
                        setParentData(prev => ({ ...prev, avatar: imageUrl }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <span className="text-white text-sm">📷</span>
              </label>
            </div>
            
            <h2 className="text-xl font-bold text-foreground mb-2">
              {getGreeting()}, {parentData.name}님!
            </h2>
            <p className="text-muted-foreground mb-3">
              오늘 하루를 함께 기억해볼까요?
            </p>
            
            {/* 오늘의 질문 알림 */}
            {parentData.pendingQuestions > 0 && (
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
                <Heart className="h-5 w-5 text-primary" />
                {getRoleDisplayName(parentData.role)} 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">최근 기록일</p>
                    <p className="text-sm font-medium">{parentData.lastRecordDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">총 답변 횟수</p>
                    <p className="text-sm font-medium">{parentData.completedQuestions}개</p>
                  </div>
                </div>
              </div>

              {/* 최근 질문 */}
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">최근 질문</p>
                <p className="text-sm font-medium mb-2">{parentData.recentQuestion}</p>
                <p className="text-sm text-muted-foreground">{parentData.recentAnswer}</p>
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
            <Card 
              className="shadow-card border-accent/10 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                const questionRecords = JSON.parse(localStorage.getItem('questionRecords') || '[]');
                const parentAnswers = questionRecords.filter((record: any) => 
                  record.parentId === parentId && 
                  record.selectedRole === (parentData.role === 'mother' ? 'mother' : 'father')
                );
                setParentAnswers(parentAnswers);
                setShowHistory(true);
              }}
            >
              <CardContent className="p-4 text-center">
                <History className="h-8 w-8 mx-auto mb-2 text-accent" />
                <h3 className="font-semibold text-sm mb-1">질문 히스토리</h3>
                <p className="text-xs text-muted-foreground">답변한 질문 전체 보기</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card border-secondary/10 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/parent/${parentId}/gallery`)}>
              <CardContent className="p-4 text-center">
                <Camera className="h-8 w-8 mx-auto mb-2 text-secondary" />
                <h3 className="font-semibold text-sm mb-1">사진첩</h3>
                <p className="text-xs text-muted-foreground">관련 사진 저장</p>
              </CardContent>
            </Card>
            
            <Card 
              className="shadow-card border-primary/10 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate('/main', { state: { activeTab: 'calendar' } })}
            >
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold text-sm mb-1">캘린더</h3>
                <p className="text-xs text-muted-foreground">일정 및 건강기록</p>
              </CardContent>
            </Card>
            
            <Card 
              className="shadow-card border-muted-foreground/10 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => alert('아직 구현이 안되었어요!')}
            >
              <CardContent className="p-4 text-center">
                <Share className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <h3 className="font-semibold text-sm mb-1">공유하기</h3>
                <p className="text-xs text-muted-foreground">질문 공유</p>
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
                    onClick={() => navigate('/main', { state: { activeTab: 'question' } })}
                  >
                    답변하러 가기
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
            <DialogTitle>{parentData.name}님의 답변 히스토리</DialogTitle>
            <DialogDescription>이 가족 구성원이 답변한 모든 질문과 답변을 확인할 수 있습니다.</DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto space-y-4 mt-4">
            {parentAnswers.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">아직 답변한 질문이 없어요</div>
            ) : (
              parentAnswers.map((record, idx) => (
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