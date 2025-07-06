import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RoleSelection } from "@/components/RoleSelection";
import { QuestionScreen } from "@/components/QuestionScreen";
import { GrowthIllustration } from "@/components/GrowthIllustration";
import { CompletionScreen } from "@/components/CompletionScreen";
import { mockQuestions } from "@/data/questions";
import type { Question } from "@/data/questions";

type AppState = 'role-selection' | 'questions' | 'growth' | 'completed';

interface UserData {
  answers: Record<number, string>;
}

const Index = () => {
  const navigate = useNavigate();
  const [appState, setAppState] = useState<AppState>('role-selection');
  const [userData, setUserData] = useState<UserData>({
    answers: {}
  });
  const [currentChapter, setCurrentChapter] = useState(1);
  const [showGrowth, setShowGrowth] = useState(false);

  const handleRoleSelect = () => {
    console.log('Starting questions');
    setAppState('questions');
  };

  const handleAnswer = (questionId: number, answer: string, chapter: number, questionNumber: number) => {
    const newAnswers = { ...userData.answers, [questionId]: answer };
    setUserData({ ...userData, answers: newAnswers });
    
    console.log(`Chapter ${chapter}, Question ${questionNumber}: ${answer}`);
  };

  const handleChapterComplete = (chapter: number) => {
    console.log(`Chapter ${chapter} completed!`);
    setCurrentChapter(chapter);
    setShowGrowth(true);
  };

  const handleGrowthContinue = () => {
    setShowGrowth(false);
    if (currentChapter >= 3) {
      setAppState('completed');
    }
  };

  const handleQuestionComplete = () => {
    // 답변 데이터를 localStorage에 저장
    localStorage.setItem('parentAnswers', JSON.stringify(userData.answers));
    console.log('Answers saved to localStorage:', userData.answers);
    
    if (!showGrowth) {
      setAppState('completed');
    }
  };

  const handleRestart = () => {
    setAppState('role-selection');
    setUserData({ answers: {} });
    setCurrentChapter(1);
    setShowGrowth(false);
  };

  const handleGoToMain = () => {
    navigate('/main');
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
              questions={mockQuestions}
              userRole="child"
              onAnswer={handleAnswer}
              onChapterComplete={handleChapterComplete}
              onComplete={handleQuestionComplete}
              onGoToMain={() => {}}
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
              onRestart={handleRestart}
              onGoToMain={handleGoToMain}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
