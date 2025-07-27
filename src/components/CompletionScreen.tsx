import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, Heart, Star, ArrowRight } from "lucide-react";

interface CompletionScreenProps {
  answers: Record<number, string>;
  onRestart: () => void;
  onGoToMain: () => void;
}

export function CompletionScreen({ answers, onRestart, onGoToMain }: CompletionScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md text-center"
      >
        {/* Trophy Animation */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring", bounce: 0.4 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Glowing background */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl"
            />
            
            {/* Trophy */}
            <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-full mx-auto w-24 h-24 flex items-center justify-center shadow-glow">
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Trophy className="h-12 w-12 text-white" />
              </motion.div>
            </div>

            {/* Confetti particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${30 + (i * 10)}%`,
                  top: `${20 + (i % 4) * 20}%`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  x: [0, 10, -10, 0],
                  rotate: [0, 360],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3 + (i * 0.2),
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {i % 3 === 0 ? (
                  <Star className="h-3 w-3 text-yellow-400" />
                ) : i % 3 === 1 ? (
                  <Heart className="h-3 w-3 text-pink-400" />
                ) : (
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Completion Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-4">
            답변 감사해요.
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            나는 잘 알지만, 부모님에 대해 잘 모르고 있진 않나요?
          </p>
          <p className="text-lg text-primary font-medium">
            잘잇지 앱이 도와줄게요!
          </p>
        </motion.div>

        {/* Record Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mb-8"
        >
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.4 }}
          className="space-y-3"
        >
          <Button
            variant="gradient"
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            onClick={onGoToMain}
          >
            메인 페이지로 넘어가기
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
