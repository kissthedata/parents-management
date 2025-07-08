import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PhotoQuiz } from "@/components/PhotoQuiz";
import { Camera, Users, TrendingUp, ArrowRight } from "lucide-react";
import { supabase } from '../lib/supabaseClient';
import { useEffect } from "react";

const Home = () => {
  // Mock data - would come from backend/state management
  const todayQuestions = [
    "가족과 함께 가고 싶은 여행지는?",
    "오늘 가장 고마웠던 순간은?",
    "내일 가장 기대되는 일은?"
  ];

  const relationshipIndex = 78; // Mock percentage

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from('your_table').select('*');
      console.log(data, error);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            잘잇지
          </h1>
          <p className="text-muted-foreground mt-2">가족과의 소중한 연결</p>
        </div>

        {/* Today's Questions */}
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              오늘의 질문
              <Badge variant="secondary">3/3</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayQuestions.map((question, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/30 hover:bg-primary/5 transition-colors cursor-pointer">
                <p className="text-sm font-medium">{question}</p>
              </div>
            ))}
            <Button className="w-full mt-4" size="lg">
              질문 시작하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Relationship Index */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-secondary/10">
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
              관계 지수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{relationshipIndex}%</div>
                <p className="text-sm text-muted-foreground">가족과의 연결 상태</p>
              </div>
              <Progress value={relationshipIndex} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>시작</span>
                <span>완벽한 연결</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Our Family Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>우리 가족?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
              <p className="text-sm font-medium mb-2">부모-자녀 답변 비교</p>
              <p className="text-xs text-muted-foreground">서로의 답변을 확인하고 대화해보세요</p>
            </div>
            <Button variant="outline" className="w-full">
              답변 비교하기
            </Button>
          </CardContent>
        </Card>

        {/* Photo Quiz */}
        <PhotoQuiz />
      </div>
    </div>
  );
};

export default Home;