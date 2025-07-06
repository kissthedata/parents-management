import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { MainPage } from "./pages/MainPage";
import { useState } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  const navigate = useNavigate();
  const [questionResults, setQuestionResults] = useState<Array<{
    question: string;
    answer: string;
    category: 'parent' | 'family';
    chapter: number;
  }>>([]);
  
  const handleStartQuestions = () => {
    navigate('/question');
  };

  const handleQuestionResults = (results: Array<{
    question: string;
    answer: string;
    category: 'parent' | 'family';
    chapter: number;
  }>) => {
    setQuestionResults(results);
    navigate('/main');
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/main" replace />} />
      <Route path="/main" element={
        <MainPage 
          onStartQuestions={handleStartQuestions} 
          onQuestionResults={questionResults}
        />
      } />
      <Route path="/question" element={
        <Index onQuestionComplete={handleQuestionResults} />
      } />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
