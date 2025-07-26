import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Smile, HelpCircle } from "lucide-react"; // Heart 아이콘 제거
import { useNavigate, useParams } from "react-router-dom";

// 데이터 타입 정의
interface QuestionRecord {
  id: string;
  question: string;
  answer: string;
  category: 'parent' | 'family';
  date: string;
  type: 'daily' | 'quiz';
  parentId?: string;
  selectedRole?: 'mother' | 'father'; // selectedRole 추가
}

interface FamilyMember {
  id: string;
  name: string;
  role: 'parent' | 'child';
  avatar?: string;
}

export function ParentReport() {
  const navigate = useNavigate();
  const { parentId } = useParams<{ parentId: string }>();
  
  const [parent, setParent] = useState<FamilyMember | null>(null);
  const [reportData, setReportData] = useState<any>({
    totalAnswered: 0,
    momentAnswers: [], // tasteAnswers 제거
    unansweredQuestions: [],
  });

  useEffect(() => {
    // 데이터 로드 및 처리
    const familyMembers = JSON.parse(localStorage.getItem('familyMembers') || '[]') as FamilyMember[];
    const currentParent = familyMembers.find(m => m.id === parentId);
    setParent(currentParent || null);

    if (currentParent) {
      const allRecords = JSON.parse(localStorage.getItem('questionRecords') || '[]') as QuestionRecord[];
      
      // parentId와 selectedRole을 모두 사용하여 정확하게 필터링
      const parentRecords = allRecords.filter(r => 
        r.parentId === parentId && 
        r.category === 'parent' && 
        r.type === 'daily' &&
        r.selectedRole === (currentParent.name === '어머니' ? 'mother' : 'father') // 이름으로 역할 매핑
      );

      const momentAnswers = parentRecords; // 모든 일상 질문 답변을 포함
      
      // 전체 부모님 질문 리스트 (임시) - 실제 질문 데이터와 일치하도록 필요시 수정
      const parentQuestions = [
        "부모님께 고마웠던 순간, 기억나는 게 있나요?",
        "{어머님}이 좋아하시는 음식, 혹시 떠오르나요?",
        "{아버님} 생신은 언제인지 기억하고 계신가요?",
        "{어머님}이 좋아하는 색깔, 어떤 색이었나요?",
        "{아버님}은 어떤 일을 하고 계셨나요?",
        "{어머님}이 좋아하는 계절은 언제인가요?",
        "{아버님}의 취미는 무엇이었나요?",
      ];

      // 답변된 질문 목록 생성 시에도 역할 플레이스홀더를 실제 이름으로 교체
      const answeredQuestions = parentRecords.map(r => {
        const roleName = r.selectedRole === 'mother' ? '어머님' : '아버님';
        return r.question.replace(/\{어머님\}|\{아버님\}/g, roleName);
      });

      const unansweredQuestions = parentQuestions
        .map(q => {
          const roleName = currentParent.name === '어머니' ? '어머님' : '아버님';
          return q.replace(/\{어머님\}|\{아버님\}/g, roleName);
        })
        .filter(q => !answeredQuestions.includes(q))
        .slice(0, 3);

      setReportData({
        totalAnswered: parentRecords.length,
        momentAnswers,
        unansweredQuestions,
      });
    }
  }, [parentId, parent]); // parent 의존성 추가
  
  if (!parent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>부모님 정보를 찾을 수 없습니다.</p>
        <Button onClick={() => navigate('/main')} className="ml-4">홈으로</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate('/main')} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            홈
          </Button>
          <h1 className="text-lg font-semibold text-foreground">{parent.name} 리포트</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6 pb-10">
        {/* 리포트 요약 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="shadow-card border-primary/10 text-center">
            <CardHeader>
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-2xl font-bold text-white border-4 border-white shadow-lg">
                {parent.avatar ? <img src={parent.avatar} alt={parent.name} className="w-full h-full object-cover rounded-full" /> : <span>{parent.name.charAt(0)}</span>}
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl mb-2">{parent.name}에 대해</CardTitle>
              <p className="text-3xl font-bold text-primary mb-2">{reportData.totalAnswered}개</p>
              <p className="text-muted-foreground">의 기억이 쌓였어요!</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 소중한 순간 카드 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className="shadow-card border-accent/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Smile className="h-5 w-5 text-accent" />{parent.name}와의 소중한 순간</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reportData.momentAnswers.length > 0 ? reportData.momentAnswers.map(r => (
                <div key={r.id} className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">{r.question}</p>
                  <p className="text-foreground font-medium">{r.answer}</p>
                </div>
              )) : <p className="text-sm text-muted-foreground text-center py-4">아직 소중한 순간에 대한 답변이 없어요.</p>}
            </CardContent>
          </Card>
        </motion.div>

        {/* 더 알아보기 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Button onClick={() => navigate('/main', { state: { activeTab: 'question' } })} className="w-full mt-2">질문 답변하러 가기</Button>
        </motion.div>
      </div>
    </div>
  );
}