import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sprout, TreePine, Flower, ArrowRight } from "lucide-react";

interface GrowthIllustrationProps {
  chapter: number;
  onContinue: () => void;
  role?: 'parent' | 'child';
  showChapter2Guide?: boolean;
}

const chapterData = {
  1: {
    title: "첫 번째 챕터 완료! 🌱",
    subtitle: "",
    icon: Sprout,
    gradient: "from-green-400 to-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20"
  },
  2: {
    title: "잘하셨어요! 🌿",
    subtitle: "가족과 어떤 일을 보내셨나요?",
    icon: TreePine,
    gradient: "from-emerald-400 to-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20"
  },
  3: {
    title: "아름다운 꽃이 피었어요! 🌸",
    subtitle: "꿈과 희망으로 가득한 미래를 그려봤습니다",
    icon: Flower,
    gradient: "from-pink-400 to-pink-600",
    bgColor: "bg-pink-50 dark:bg-pink-950/20"
  }
};

export function GrowthIllustration({ chapter, onContinue, role, showChapter2Guide }: GrowthIllustrationProps) {
  const data = chapterData[chapter as keyof typeof chapterData];
  
  if (!data) return null;

  const IconComponent = data.icon;

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md text-center"
      >
        {/* Main Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8"
        >
          <Card className={`${data.bgColor} border-0 shadow-glow`}>
            <CardContent className="p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 0.6, 
                  duration: 0.8,
                  type: "spring",
                  bounce: 0.4
                }}
                className="relative"
              >
                {/* Animated background glow */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`absolute inset-0 bg-gradient-to-r ${data.gradient} rounded-full blur-xl`}
                />
                
                {/* Main Icon */}
                <div className={`relative bg-gradient-to-r ${data.gradient} p-6 rounded-full mx-auto w-24 h-24 flex items-center justify-center`}>
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <IconComponent className="h-12 w-12 text-white" />
                  </motion.div>
                </div>

                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-primary/30 rounded-full"
                    style={{
                      left: `${20 + (i * 15)}%`,
                      top: `${10 + (i % 3) * 30}%`,
                    }}
                    animate={{
                      y: [-10, 10, -10],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{
                      duration: 2 + (i * 0.3),
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground mb-3">
            {data.title}
          </h1>
          <p className="text-muted-foreground text-lg">
            {data.subtitle}
          </p>
        </motion.div>

        {/* Progress Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
          className="flex justify-center gap-2 mb-8"
        >
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                num <= chapter 
                  ? 'bg-primary shadow-glow' 
                  : 'bg-muted'
              }`}
            />
          ))}
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          <Button
            onClick={onContinue}
            variant="gradient"
            size="lg"
            className="w-full flex items-center justify-center gap-2"
          >
            다음 챕터로
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Chapter 2 안내 문구 */}
        {showChapter2Guide && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.4 }}
            className="text-base text-primary font-semibold mt-6"
          >
            {role === 'parent'
              ? '좋아요! 부모님에 대해서도 잘 아나요?'
              : '이제, 부모님에 대해 알아볼까요?'}
          </motion.p>
        )}

        {/* Achievement text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.4 }}
          className="text-sm text-muted-foreground mt-4"
        >
          챕터 {chapter}/3 완료! ✨
        </motion.p>
      </motion.div>
    </div>
  );
}