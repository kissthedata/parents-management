import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RoleSelection } from "@/components/RoleSelection";
import { QuestionScreen } from "@/components/QuestionScreen";
import { GrowthIllustration } from "@/components/GrowthIllustration";
import { CompletionScreen } from "@/components/CompletionScreen";
import { mockQuestions } from "@/data/questions";
import type { Question } from "@/data/questions";

type AppState = 'role-selection' | 'questions' | 'growth' | 'completed';

interface UserData {
  role: 'parent' | 'child';
  code?: string;
  answers: Record<number, string>;
}

interface IndexProps {
  onQuestionComplete?: (results: Array<{
    question: string;
    answer: string;
    category: 'parent' | 'family';
    chapter: number;
  }>) => void;
}

const Index = ({ onQuestionComplete }: IndexProps) => {
  const [appState, setAppState] = useState<AppState>('role-selection');
  const [userData, setUserData] = useState<UserData>({
    role: 'parent',
    answers: {}
  });
  const [currentChapter, setCurrentChapter] = useState(1);
  const [showGrowth, setShowGrowth] = useState(false);

  const handleRoleSelect = (role: 'parent' | 'child', code?: string) => {
    setUserData({ ...userData, role, code });
    console.log(`Role selected: ${role}${code ? ` with code: ${code}` : ''}`);
    setAppState('questions');
  };

  const handleAnswer = (questionId: number, answer: string, chapter: number, questionNumber: number) => {
    const newAnswers = { ...userData.answers, [questionId]: answer };
    setUserData({ ...userData, answers: newAnswers });
    
    console.log(`Chapter ${chapter}, Question ${questionNumber}: ${answer}`);
  };

  const handleChapterComplete = (chapter: number) => {
    console.log(`Chapter ${chapter} completed!`);
    // 마지막 챕터가 아닐 때만 GrowthIllustration을 보여줍니다.
    if (chapter < 3) {
      setCurrentChapter(chapter);
      setShowGrowth(true);
    }
  };

  const handleGrowthContinue = () => {
    setShowGrowth(false);
    setCurrentChapter(currentChapter + 1);
  };

  const handleQuestionComplete = () => {
    // 모든 질문이 완료되었을 때 이 함수가 호출되어 완료 화면으로 상태를 변경합니다.
    const results = Object.entries(userData.answers).map(([questionId, answer]) => {
      const question = mockQuestions.find(q => q.id === parseInt(questionId));
      return {
        question: question?.text || '질문',
        answer: answer,
        category: (question?.chapter === 2 ? 'parent' : 'family') as 'parent' | 'family',
        chapter: question?.chapter || 1
      };
    });
    
    if (onQuestionComplete) {
      onQuestionComplete(results);
    }
    
    setAppState('completed');
  };

  const handleRestart = () => {
    // 메인 페이지로 이동
    window.location.href = '/main';
  };

  const handleGoToMain = () => {
    // 메인 페이지로 이동
    window.location.href = '/main';
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {appState === 'role-selection' && (
          <motion.div
            key="role-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <RoleSelection onRoleSelect={handleRoleSelect} />
          </motion.div>
        )}

        {appState === 'questions' && !showGrowth && (
          <motion.div
            key="questions"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <QuestionScreen
              questions={mockQuestions.filter(q => q.chapter === currentChapter)}
              userRole={userData.role}
              onAnswer={handleAnswer}
              onChapterComplete={handleChapterComplete}
              onComplete={handleQuestionComplete}
              onGoToMain={handleGoToMain}
            />
          </motion.div>
        )}

        {appState === 'questions' && showGrowth && (
          <motion.div
            key="growth"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6 }}
          >
            <GrowthIllustration
              chapter={currentChapter}
              onContinue={handleGrowthContinue}
              role={userData.role}
              showChapter2Guide={currentChapter === 1}
            />
          </motion.div>
        )}

        {appState === 'completed' && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <CompletionScreen
              answers={userData.answers}
              onGoToMain={handleGoToMain}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;