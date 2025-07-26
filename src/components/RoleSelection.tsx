import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ArrowLeft } from "lucide-react"; // ArrowLeft 아이콘 추가
import { useNavigate } from "react-router-dom"; // useNavigate 훅 추가

interface RoleSelectionProps {
  onRoleSelect: (role: 'parent' | 'child', code?: string) => void;
}

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  const navigate = useNavigate(); // useNavigate 훅 사용

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold text-foreground mb-2"
          >
            질문 몇 개만 해볼게요!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-muted-foreground"
          >
            
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="shadow-card border-primary/10">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  준비됐나요?
                </h3>
                <p className="text-sm text-muted-foreground">
                  그럼, 질문 몇 개만 할게요!
                </p>
              </div>
              
              <Button
                onClick={() => onRoleSelect('parent')}
                variant="gradient"
                size="lg"
                className="w-full"
              >
                네!
              </Button>
              <Button
                onClick={() => navigate(-1)} // 뒤로 가기
                variant="outline"
                size="lg"
                className="w-full mt-2"
              >
                <ArrowLeft className="h-5 w-5 mr-2" /> 뒤로 가기
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}