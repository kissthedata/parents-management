import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Question {
  id: number;
  chapter: number;
  questionNumber: number;
  text: string;
  options: string[];
}

interface QuestionScreenProps {
  questions: Question[];
  userRole: 'parent' | 'child';
  onAnswer: (questionId: number, answer: string, chapter: number, questionNumber: number) => void;
  onChapterComplete: (chapter: number) => void;
  onComplete: () => void;
  onGoToMain: () => void;
}

export function QuestionScreen({ questions, userRole, onAnswer, onChapterComplete, onComplete, onGoToMain }: QuestionScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [customInput, setCustomInput] = useState<string>("");
  const [multiAnswers, setMultiAnswers] = useState<string[]>([]);
  const [month, setMonth] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [disableDate, setDisableDate] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const currentQuestion = questions[currentQuestionIndex];
  const questionInChapter = ((currentQuestionIndex) % 5) + 1;
  const progress = (questionInChapter / 5) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isLastQuestionInChapter = currentQuestion && (currentQuestionIndex + 1) % 5 === 0;

  const handleAnswerSelect = (answer: string) => {
    if (answer === '잘 모르겠어요' && selectedAnswer === '잘 모르겠어요') {
      setSelectedAnswer("");
      setDisableDate(false);
    } else if (answer === '잘 모르겠어요') {
      setSelectedAnswer('잘 모르겠어요');
      setDisableDate(true);
      setMonth("");
      setDay("");
    } else {
      setSelectedAnswer(answer);
      setCustomInput("");
      setMultiAnswers([]);
      setMonth("");
      setDay("");
      setDisableDate(false);
    }
  };

  const handleMultiCardSelect = (option: string) => {
    setSelectedAnswer("");
    setCustomInput("");
    setMonth("");
    setDay("");
    setDisableDate(false);
    setMultiAnswers(prev =>
      prev.includes(option)
        ? prev.filter(a => a !== option)
        : [...prev, option]
    );
  };

  const handleNext = () => {
    let answerToSave = "";
    if (currentQuestion.chapter === 2 && (currentQuestion.questionNumber === 1 || currentQuestion.questionNumber === 2)) {
      if (selectedAnswer === '잘 모르겠어요') {
        answerToSave = '잘 모르겠어요';
      } else if (month && day) {
        answerToSave = `${month}월 ${day}일`;
      }
    } else if ((currentQuestion.chapter === 2 && (currentQuestion.questionNumber === 3 || currentQuestion.questionNumber === 5))) {
      if (multiAnswers.includes('직접 입력...') && customInput.trim()) {
        answerToSave = multiAnswers.filter(a => a !== '직접 입력...').concat(customInput.trim()).join(', ');
      } else {
        answerToSave = multiAnswers.join(', ');
      }
    } else if (selectedAnswer === '직접 입력...') {
      answerToSave = customInput.trim();
    } else {
      answerToSave = selectedAnswer;
    }
    if (!answerToSave) return;
    const newAnswers = { ...answers, [currentQuestion.id]: answerToSave };
    setAnswers(newAnswers);
    onAnswer(currentQuestion.id, answerToSave, currentQuestion.chapter, currentQuestion.questionNumber);
    if (isLastQuestionInChapter) {
      onChapterComplete(currentQuestion.chapter);
    }
    if (isLastQuestion) {
      onComplete();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer("");
      setCustomInput("");
      setMultiAnswers([]);
      setMonth("");
      setDay("");
      setDisableDate(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(answers[questions[currentQuestionIndex - 1].id] || "");
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gradient-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-sm font-medium text-muted-foreground">
                챕터 {currentQuestion.chapter}
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                질문 {questionInChapter}/5
              </span>
            </motion.div>
          </div>
          <Progress 
            value={progress} 
            className="h-2"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="shadow-card border-primary/10">
                <CardContent className="p-8">
                  {currentQuestion.chapter === 2 && questionInChapter === 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      className="text-center mb-6"
                    >
                      <p className="text-lg text-primary font-medium">
                        부모님에 대해 여쭈어볼게요!
                      </p>
                    </motion.div>
                  )}
                  
                  {currentQuestion.chapter === 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      className="text-center mb-4"
                    >
                      <p className="text-sm text-muted-foreground font-medium">
                        본인이
                      </p>
                    </motion.div>
                  )}
                  
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl font-bold text-center mb-8 text-foreground"
                  >
                    {currentQuestion.text}
                  </motion.h2>

                  <div className="space-y-3">
                    {/* 챕터2 1,2번: 월/일 드롭다운 + '잘 모르겠어요' 카드형 */}
                    {(currentQuestion.chapter === 2 && (currentQuestion.questionNumber === 1 || currentQuestion.questionNumber === 2)) && (
                      <>
                        <div className="flex gap-2 justify-center mb-4">
                          <Select value={month} onValueChange={setMonth} disabled={disableDate}>
                            <SelectTrigger className="w-28">
                              <SelectValue placeholder="월 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {[...Array(12)].map((_, i) => (
                                <SelectItem key={i+1} value={String(i+1)}>{i+1}월</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select value={day} onValueChange={setDay} disabled={disableDate}>
                            <SelectTrigger className="w-28">
                              <SelectValue placeholder="일 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {[...Array(31)].map((_, i) => (
                                <SelectItem key={i+1} value={String(i+1)}>{i+1}일</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-dashed ${
                              selectedAnswer === '잘 모르겠어요'
                                ? 'ring-2 ring-primary bg-primary/5 shadow-glow'
                                : 'hover:bg-accent/5'
                            }`}
                            onClick={() => handleAnswerSelect('잘 모르겠어요')}
                          >
                            <CardContent className="p-4">
                              <p className="text-center text-muted-foreground">잘 모르겠어요</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </>
                    )}
                    {/* 챕터2 3,5번: 카드형 복수선택 */}
                    {(currentQuestion.chapter === 2 && (currentQuestion.questionNumber === 3 || currentQuestion.questionNumber === 5)) && (
                      <div className="flex flex-wrap gap-3 justify-center">
                        {currentQuestion.options.map((option, idx) => (
                          <div key={option} className="w-40">
                            <Card
                              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                                multiAnswers.includes(option)
                                  ? 'ring-2 ring-primary bg-primary/5 shadow-glow'
                                  : 'hover:bg-accent/5'
                              }`}
                              onClick={() => handleMultiCardSelect(option)}
                            >
                              <CardContent className="p-4 flex items-center justify-center">
                                <span>{option}</span>
                              </CardContent>
                            </Card>
                            {option === '직접 입력...' && multiAnswers.includes('직접 입력...') && (
                              <div className="mt-3">
                                <input
                                  type="text"
                                  className="w-full border rounded px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                                  placeholder="직접 입력해 주세요"
                                  value={customInput}
                                  onChange={e => setCustomInput(e.target.value)}
                                  maxLength={100}
                                  autoFocus
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {/* 챕터2 4번: 단일선택 카드형 + 직접입력 */}
                    {currentQuestion.chapter === 2 && currentQuestion.questionNumber === 4 && (
                      <>
                        {currentQuestion.options.map((option, index) => (
                          <motion.div
                            key={option}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                          >
                            <Card
                              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                                selectedAnswer === option
                                  ? 'ring-2 ring-primary bg-primary/5 shadow-glow'
                                  : 'hover:bg-accent/5'
                              }`}
                              onClick={() => handleAnswerSelect(option)}
                            >
                              <CardContent className="p-4">
                                <p className="text-center">{option}</p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                        {selectedAnswer === '직접 입력...' && (
                          <div className="mt-3">
                            <input
                              type="text"
                              className="w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="직접 입력해 주세요"
                              value={customInput}
                              onChange={e => setCustomInput(e.target.value)}
                              maxLength={100}
                              autoFocus
                            />
                          </div>
                        )}
                      </>
                    )}
                    {/* 그 외: 기존 단일선택 카드형 */}
                    {!(currentQuestion.chapter === 2 && [1,2,3,4,5].includes(currentQuestion.questionNumber)) && (
                      <>
                        {currentQuestion.options.map((option, index) => (
                          <motion.div
                            key={option}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                          >
                            <Card
                              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                                selectedAnswer === option
                                  ? 'ring-2 ring-primary bg-primary/5 shadow-glow'
                                  : 'hover:bg-accent/5'
                              }`}
                              onClick={() => handleAnswerSelect(option)}
                            >
                              <CardContent className="p-4">
                                <p className="text-center">{option}</p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                        {selectedAnswer === '직접 입력...' && (
                          <div className="mt-3">
                            <input
                              type="text"
                              className="w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="답변을 입력하세요"
                              value={customInput}
                              onChange={e => setCustomInput(e.target.value)}
                              maxLength={100}
                              autoFocus
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/10">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            이전
          </Button>

          <Button
            variant="outline"
            onClick={onGoToMain}
            className="bg-muted hover:bg-muted/80"
          >
            메인페이지로 가기
          </Button>

          <motion.div
            animate={selectedAnswer ? { scale: 1 } : { scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="gradient"
              onClick={handleNext}
              disabled={
                // 챕터2 1,2번: 월/일 모두 선택 또는 '잘 모르겠어요' 선택해야 활성화
                (currentQuestion.chapter === 2 && (currentQuestion.questionNumber === 1 || currentQuestion.questionNumber === 2)) ?
                  (!(month && day) && selectedAnswer !== '잘 모르겠어요') :
                // 챕터2 3,5번: 최소 1개 이상 체크, 직접입력 선택시 값 필수
                (currentQuestion.chapter === 2 && (currentQuestion.questionNumber === 3 || currentQuestion.questionNumber === 5)) ?
                  (multiAnswers.length === 0 || (multiAnswers.includes('직접 입력...') && !customInput.trim())) :
                // 챕터2 4번: 직접입력 선택시 값 필수
                (currentQuestion.chapter === 2 && currentQuestion.questionNumber === 4 && selectedAnswer === '직접 입력...' && !customInput.trim()) ? true :
                // 그 외: 기존 로직
                (!selectedAnswer || (selectedAnswer === '직접 입력...' && !customInput.trim()))
              }
              className="flex items-center gap-2 px-8"
            >
              {isLastQuestion ? '완료' : '다음'}
              {!isLastQuestion && <ArrowRight className="h-4 w-4" />}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}