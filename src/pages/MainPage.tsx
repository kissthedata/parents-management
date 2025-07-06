import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  Image as Album, 
  Settings, 
  Upload, 
  Heart, 
  Users, 
  Camera,
  ArrowRight,
  Plus,
  BookOpen,
  Phone,
  Gift,
  MessageCircle
} from "lucide-react";
import { HeaderSection } from "@/components/HeaderSection";
import { CategoryTabs } from "@/components/CategoryTabs";
import { DailyQuestionCard } from "@/components/DailyQuestionCard";
import { UnisonQuizCard } from "@/components/UnisonQuizCard";
import { BottomNavBar } from "@/components/BottomNavBar";
import { PrivacyConsentModal } from "@/components/PrivacyConsentModal";

type TabType = 'home' | 'question' | 'calendar' | 'family' | 'settings';

interface MainPageProps {
  onStartQuestions: () => void;
  onQuestionResults?: Array<{
    question: string;
    answer: string;
    category: 'parent' | 'family';
    chapter: number;
  }>;
}

// 질문 기록 데이터 타입
interface QuestionRecord {
  id: string;
  question: string;
  answer: string;
  category: 'parent' | 'family';
  date: string;
  type: 'daily' | 'quiz';
}

// 가족 멤버 타입
interface FamilyMember {
  id: string;
  name: string;
  role: 'parent' | 'child';
  joinDate: string;
  avatar?: string;
}

const parentQuestions = [
  "부모님께 고마웠던 순간, 기억나는 게 있나요?",
  "어머님이 좋아하시는 음식, 혹시 떠오르나요?",
  "아버님 생신은 언제인지 기억하고 계신가요?",
  "어머님이 좋아하는 색깔, 어떤 색이었나요?",
  "아버님은 어떤 일을 하고 계셨나요?",
  "어머님이 좋아하는 계절은 언제인가요?",
  "아버님의 취미는 무엇이었나요?",
  "어머님이 즐겨 보셨던 영화가 있다면요?",
  "아버님은 어떤 꿈을 가지고 계셨나요?",
  "어머님이 가장 좋아하시는 장소는 어디인가요?",
  "아버님에게 가장 소중했던 추억은 무엇일까요?",
  "어머님이 자주 들으셨던 노래가 있다면요?",
  "요즘 아버님이 가장 걱정하고 계신 일은 뭘까요?",
  "어머님이 좋아하시는 꽃, 기억나시나요?",
  "아버님이 자랑스러워했던 일이 있다면요?",
  "어머님이 즐겨 하시던 운동은 어떤 거였나요?",
  "아버님의 바람 중 하나, 떠오르는 게 있나요?",
  "어머님이 좋아하셨던 책이 있다면요?",
  "아버님이 이뤄내셨던 일 중 가장 자랑스러운 건 뭘까요?",
  "어머님이 자주 드시던 음료가 있다면요?",
  "요즘 아버님이 가장 고민하고 계신 건 뭘까요?",
  "어머님이 좋아하시는 동물이 있다면요?",
  "아버님을 정말 기쁘게 했던 일이 무엇이었을까요?",
  "어머님이 좋아하는 과일, 기억나시나요?",
  "아버님이 눈물을 보이셨던 일이 있다면요?",
  "어머님이 자주 만들어주시던 요리, 뭐가 떠오르세요?",
  "아버님이 품고 계신 희망이 있다면 어떤 걸까요?",
  "어머님이 빠지지 않고 챙겨보셨던 드라마가 있다면요?",
  "아버님이 최근에 고마워하셨던 일이 있다면요?",
  "어머님이 가보고 싶어 하셨던 여행지는 어디인가요?"
];

// 30개의 가족 질문
const familyQuestions = [
  "가족과 처음으로 여행 갔던 기억, 혹시 나시나요?",
  "어릴 때 가족끼리 자주 갔던 장소가 있나요?",
  "가족과 함께 웃었던 일 중 가장 기억에 남는 건 뭐예요?",
  "어릴 때 가족이랑 함께한 생일 중 가장 특별했던 날은 언제였나요?",
  "가족과 함께한 명절 중 유난히 따뜻했던 순간이 있었나요?",
  "처음으로 가족과 영화관에 갔던 기억, 혹시 기억나세요?",
  "비 오는 날 가족과 함께 했던 기억이 있다면요?",
  "밤에 가족들과 도란도란 이야기 나눴던 적이 있나요?",
  "어릴 때 부모님이 자주 해주신 말 중에 아직도 기억나는 게 있나요?",
  "가족과 함께 만든 음식 중 가장 맛있었던 건 뭐였나요?",
  "가족끼리 처음으로 찍은 사진, 언제였나요?",
  "가족과 함께 밤하늘을 본 기억이 있다면요?",
  "처음으로 가족끼리 캠핑이나 피크닉 갔던 날 기억나요?",
  "어릴 적 가족에게 편지를 써 본 적이 있나요?",
  "가족과 함께 웃다가 눈물 날 뻔했던 순간이 있었나요?",
  "가족과 함께한 하루 중 '그 날은 참 좋았다' 싶은 날이 있다면요?",
  "가족에게 고맙다고 말했던 마지막 순간, 언제였을까요?",
  "가족 모두가 같이 걱정했던 일이 지나가고 웃을 수 있었던 적이 있었나요?",
  "가족과 함께했던 특별한 계절이 있다면 언제인가요?",
  "지금도 떠올리면 마음 따뜻해지는 가족과의 순간이 있나요?"
];


const dailyQuestions = {
  parent: parentQuestions[0],
  family: familyQuestions[0]
};

const unisonQuizQuestions = [
  {
    question: "가족끼리 여행 간다면, 어디로 가장 가고 싶을까요?",
    options: ["바다 🌊", "산 🏞️", "놀이공원 🎢", "해외 ✈️"]
  },
  {
    question: "가족이 모이면 꼭 함께 먹는 음식은 뭐예요?",
    options: ["피자 🍕", "치킨 🍗", "스테이크 🥩", "샐러드 🥗"]
  },
  {
    question: "가족이 함께 하면 가장 즐거운 활동은 뭐라고 생각하세요?",
    options: ["영화 보기 🎬", "게임하기 🎮", "산책하기 🚶‍♀️", "요리하기 👩‍🍳"]
  },
  {
    question: "우리 가족의 가장 큰 자랑은 뭐라고 생각해요?",
    options: ["사랑 ❤️", "건강 💪", "성공 🏆", "화목 🫶"]
  },
  {
    question: "가족 모두가 좋아하는 계절은 언제인가요?",
    options: ["봄 🌸", "여름 ☀️", "가을 🍂", "겨울 ❄️"]
  },
  {
    question: "가족이 함께 듣기 좋은 음악 장르는 뭘까요?",
    options: ["팝 🎶", "클래식 🎻", "재즈 🎷", "락 🎸"]
  },
  {
    question: "가족이 가장 좋아하는 색깔은 무엇일까요?",
    options: ["파랑 💙", "빨강 ❤️", "초록 💚", "노랑 💛"]
  },
  {
    question: "가족이 함께 키우고 싶어 하는 동물은 무엇인가요?",
    options: ["강아지 🐶", "고양이 🐱", "새 🐦", "물고기 🐠"]
  },
  {
    question: "가족이 가장 좋아하는 꽃은 어떤 걸까요?",
    options: ["장미 🌹", "튤립 🌷", "해바라기 🌻", "라벤더 💜"]
  },
  {
    question: "가족 모두가 좋아하는 과일은 뭘까요?",
    options: ["사과 🍎", "바나나 🍌", "오렌지 🍊", "포도 🍇"]
  }
];
export function MainPage({ onStartQuestions, onQuestionResults }: MainPageProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [category, setCategory] = useState<'parent' | 'family'>('parent');
  const [quizShared, setQuizShared] = useState(false);
  
  // 질문 기록 상태
  const [questionRecords, setQuestionRecords] = useState<QuestionRecord[]>([]);
  
  // 현재 이구동성 퀴즈 상태
  const [currentUnisonQuiz, setCurrentUnisonQuiz] = useState(unisonQuizQuestions[0]);
  
  // 현재 질문 상태
  const [currentParentQuestion, setCurrentParentQuestion] = useState(parentQuestions[0]);
  const [currentFamilyQuestion, setCurrentFamilyQuestion] = useState(familyQuestions[0]);
  
  // 일정 상태 관리
  const [schedules, setSchedules] = useState<Array<{
    id: string;
    title: string;
    date: string;
    time: string;
    description: string;
  }>>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSchedules, setSelectedSchedules] = useState<Array<{
    id: string;
    title: string;
    date: string;
    time: string;
    description: string;
  }>>([]);
  
  // 새 일정 입력 상태
  const [newSchedule, setNewSchedule] = useState({
    title: '',
    date: '',
    time: '',
    description: ''
  });
  
  // 가족 관리 상태
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    const saved = localStorage.getItem('familyMembers');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: '나',
        role: 'child',
        joinDate: '2024-01-01'
      }
    ];
  });
  const [familyCode, setFamilyCode] = useState<string>('ABC123');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState<string>('');
  const [showFamilyAddModal, setShowFamilyAddModal] = useState(false);
  
  // 가족 갤러리 상태
  const [familyPhotos, setFamilyPhotos] = useState<Array<{
    id: string;
    url: string;
    title: string;
    date: string;
    uploadedBy: string;
  }>>([]);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState<{
    id: string;
    url: string;
    title: string;
    date: string;
    uploadedBy: string;
  } | null>(null);

  // 더보기 탭 상태
  const [feedbackText, setFeedbackText] = useState('');
  const [notificationEmail, setNotificationEmail] = useState('');
  const [notificationPhone, setNotificationPhone] = useState('');
  const [notificationType, setNotificationType] = useState<'email' | 'phone'>('email');
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);
  const [showNotificationSuccess, setShowNotificationSuccess] = useState(false);

  // 개인정보 동의 상태
  const [showPrivacyConsent, setShowPrivacyConsent] = useState(() => {
    const hasConsented = localStorage.getItem('privacyConsent');
    return !hasConsented; // 동의하지 않았다면 모달 표시
  });

  // 가족 멤버 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('familyMembers', JSON.stringify(familyMembers));
  }, [familyMembers]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newPhoto = {
        id: Date.now().toString(),
        url: URL.createObjectURL(file),
        title: '새로운 사진',
        date: new Date().toISOString().split('T')[0],
        uploadedBy: '나'
      };
      setFamilyPhotos(prev => [newPhoto, ...prev]);
    }
  };

  const handleDailyQuestionRegister = (answer: string) => {
    const newRecord: QuestionRecord = {
      id: Date.now().toString(),
      question: category === 'parent' ? currentParentQuestion : currentFamilyQuestion,
      answer,
      category,
      date: new Date().toISOString().split('T')[0],
      type: 'daily'
    };
    setQuestionRecords(prev => [newRecord, ...prev]);
  };

  const handleQuizRegister = (answer: string, extra: string) => {
    const newRecord: QuestionRecord = {
      id: Date.now().toString(),
      question: currentUnisonQuiz.question,
      answer: extra ? `${answer} - ${extra}` : answer,
      category: 'parent',
      date: new Date().toISOString().split('T')[0],
      type: 'quiz'
    };
    setQuestionRecords(prev => [newRecord, ...prev]);
  };

  const handleRandomUnisonQuiz = () => {
    const answeredQuestions = questionRecords
      .filter(record => record.type === 'quiz')
      .map(record => record.question);
    
    const availableQuestions = unisonQuizQuestions.filter(q => !answeredQuestions.includes(q.question));
    if (availableQuestions.length === 0) {
      // 모든 질문을 답변했다면 처음부터 다시 시작
      const randomIndex = Math.floor(Math.random() * unisonQuizQuestions.length);
      setCurrentUnisonQuiz(unisonQuizQuestions[randomIndex]);
    } else {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      setCurrentUnisonQuiz(availableQuestions[randomIndex]);
    }
  };

  // 랜덤 질문 선택 함수
  const getRandomQuestion = (questions: string[], answeredQuestions: string[]) => {
    const availableQuestions = questions.filter(q => !answeredQuestions.includes(q));
    if (availableQuestions.length === 0) {
      // 모든 질문을 답변했다면 처음부터 다시 시작
      return questions[Math.floor(Math.random() * questions.length)];
    }
    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  };

  const handleRandomParentQuestion = () => {
    const answeredQuestions = questionRecords
      .filter(record => record.category === 'parent' && record.type === 'daily')
      .map(record => record.question);
    
    const newQuestion = getRandomQuestion(parentQuestions, answeredQuestions);
    setCurrentParentQuestion(newQuestion);
  };

  const handleRandomFamilyQuestion = () => {
    const answeredQuestions = questionRecords
      .filter(record => record.category === 'family' && record.type === 'daily')
      .map(record => record.question);
    
    const newQuestion = getRandomQuestion(familyQuestions, answeredQuestions);
    setCurrentFamilyQuestion(newQuestion);
  };

  // 질문 결과를 받아서 기록에 추가하는 함수
  const handleQuestionResults = (results: Array<{
    question: string;
    answer: string;
    category: 'parent' | 'family';
    chapter: number;
  }>) => {
    const newRecords: QuestionRecord[] = results.map((result, index) => ({
      id: `quiz-chapter-${result.chapter}-${Date.now()}-${index}`,
      question: result.question,
      answer: result.answer,
      category: result.category,
      date: new Date().toISOString().split('T')[0],
      type: 'quiz'
    }));
    
    setQuestionRecords(prev => [...newRecords, ...prev]);
    
    // 질문 탭으로 자동 이동
    setActiveTab('question');
  };

  // onQuestionResults가 변경될 때마다 결과 처리
  useEffect(() => {
    if (onQuestionResults && onQuestionResults.length > 0) {
      handleQuestionResults(onQuestionResults);
    }
  }, [onQuestionResults]);

  // 더보기 탭 핸들러 함수들
  const handleFeedbackSubmit = () => {
    if (feedbackText.trim()) {
      setShowFeedbackSuccess(true);
      setFeedbackText('');
      setTimeout(() => setShowFeedbackSuccess(false), 3000);
    }
  };

  const handleNotificationSubmit = () => {
    const contact = notificationType === 'email' ? notificationEmail : notificationPhone;
    if (contact.trim()) {
      setShowNotificationSuccess(true);
      setNotificationEmail('');
      setNotificationPhone('');
      setTimeout(() => setShowNotificationSuccess(false), 3000);
    }
  };

  // 개인정보 동의 핸들러
  const handlePrivacyAccept = () => {
    localStorage.setItem('privacyConsent', 'true');
    setShowPrivacyConsent(false);
    // 여기에 GA4 초기화 코드를 추가할 수 있습니다
    console.log('GA4 개인정보 수집 동의됨');
  };

  const handlePrivacyDecline = () => {
    localStorage.setItem('privacyConsent', 'false');
    setShowPrivacyConsent(false);
    console.log('GA4 개인정보 수집 거부됨');
  };

  const renderHomeTab = () => (
    <div className="space-y-6">
      {/* 상단 배너 - 서비스 소개 */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-2xl p-6 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
          잘잇지
        </h1>
        <p className="text-lg text-foreground mb-2">
          가족과의 소중한 연결을 위한 특별한 공간
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          매일의 질문을 통해 서로를 더 깊이 이해하고,<br />
          소중한 추억을 만들어가는 가족만의 이야기
        </p>
      </div>

      {/* 가족 멤버 섹션 */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground mb-4">우리 가족</h2>
        <div className="flex justify-center items-center gap-4 mb-6">
          {/* 나 (자녀) */}
          <div className="flex flex-col items-center">
            <div 
              className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 shadow-lg cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate('/me')}
            >
              <span>나</span>
            </div>
            <span className="text-sm text-foreground">나</span>
          </div>
          
          {/* 추가된 가족 멤버들 */}
          {familyMembers.filter(member => member.role === 'parent').map((member) => (
            <div key={member.id} className="flex flex-col items-center">
              <div 
                className="w-20 h-20 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full flex items-center justify-center text-lg font-bold text-accent mb-2 shadow-lg border-2 border-accent/30 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => {
                  navigate(`/parent/${member.id}`);
                }}
              >
                {member.avatar ? (
                  <img 
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span>{member.name.charAt(0)}</span>
                )}
              </div>
              <span className="text-sm text-foreground">{member.name}</span>
            </div>
          ))}
          
          {/* 가족 추가 버튼 */}
          <div className="flex flex-col items-center">
            <div
              className="w-20 h-20 rounded-full border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-center bg-background"
              onClick={() => setShowFamilyAddModal(true)}
            >
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground mt-2">가족 추가</span>
          </div>
        </div>
      </div>

      {/* 빠른 액션 카드들 */}
      <div className="grid grid-cols-2 gap-4">
        <Card 
          className="shadow-card border-primary/10 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setActiveTab('question')}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">🔮</div>
            <h3 className="font-semibold text-sm mb-1">오늘의 질문</h3>
            <p className="text-xs text-muted-foreground">매일 새로운 질문</p>
          </CardContent>
        </Card>
        
        <Card 
          className="shadow-card border-secondary/10 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={onStartQuestions}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">📝</div>
            <h3 className="font-semibold text-sm mb-1">질문 풀기</h3>
            <p className="text-xs text-muted-foreground">15개 질문 세트</p>
          </CardContent>
        </Card>
        
        <Card 
          className="shadow-card border-accent/10 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setActiveTab('question')}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">🎲</div>
            <h3 className="font-semibold text-sm mb-1">이구동성 퀴즈</h3>
            <p className="text-xs text-muted-foreground">가족과 함께</p>
          </CardContent>
        </Card>
        
        <Card 
          className="shadow-card border-muted-foreground/10 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setActiveTab('calendar')}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">📅</div>
            <h3 className="font-semibold text-sm mb-1">캘린더</h3>
            <p className="text-xs text-muted-foreground">가족 일정</p>
          </CardContent>
        </Card>
      </div>

      {/* 가족 추가 모달 */}
      {showFamilyAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowFamilyAddModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="shadow-2xl border-0">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">가족 추가</CardTitle>
                <p className="text-sm text-muted-foreground">추가할 가족을 선택해주세요</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-14 text-left justify-start"
                  onClick={() => {
                    const newMember: FamilyMember = {
                      id: Date.now().toString(),
                      name: '아버지',
                      role: 'parent',
                      joinDate: new Date().toISOString().split('T')[0]
                    };
                    setFamilyMembers(prev => [...prev, newMember]);
                    setShowFamilyAddModal(false);
                  }}
                >
                  <Users className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <div className="font-medium">아버지</div>
                    <div className="text-xs text-muted-foreground">부모님</div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full h-14 text-left justify-start"
                  onClick={() => {
                    const newMember: FamilyMember = {
                      id: Date.now().toString(),
                      name: '어머니',
                      role: 'parent',
                      joinDate: new Date().toISOString().split('T')[0]
                    };
                    setFamilyMembers(prev => [...prev, newMember]);
                    setShowFamilyAddModal(false);
                  }}
                >
                  <Heart className="h-5 w-5 mr-3 text-pink-600" />
                  <div>
                    <div className="font-medium">어머니</div>
                    <div className="text-xs text-muted-foreground">부모님</div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full h-14 text-left justify-start"
                  onClick={() => {
                    const newMember: FamilyMember = {
                      id: Date.now().toString(),
                      name: '할아버지',
                      role: 'parent',
                      joinDate: new Date().toISOString().split('T')[0]
                    };
                    setFamilyMembers(prev => [...prev, newMember]);
                    setShowFamilyAddModal(false);
                  }}
                >
                  <Users className="h-5 w-5 mr-3 text-green-600" />
                  <div>
                    <div className="font-medium">할아버지</div>
                    <div className="text-xs text-muted-foreground">조부모님</div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full h-14 text-left justify-start"
                  onClick={() => {
                    const newMember: FamilyMember = {
                      id: Date.now().toString(),
                      name: '할머니',
                      role: 'parent',
                      joinDate: new Date().toISOString().split('T')[0]
                    };
                    setFamilyMembers(prev => [...prev, newMember]);
                    setShowFamilyAddModal(false);
                  }}
                >
                  <Heart className="h-5 w-5 mr-3 text-purple-600" />
                  <div>
                    <div className="font-medium">할머니</div>
                    <div className="text-xs text-muted-foreground">조부모님</div>
                  </div>
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full mt-4"
                  onClick={() => setShowFamilyAddModal(false)}
                >
                  취소
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );

  const renderQuestionTab = () => (
    <div className="space-y-6">
      <HeaderSection />
      <CategoryTabs value={category} onChange={val => setCategory(val as any)} />
      <DailyQuestionCard
        question={category === 'parent' ? currentParentQuestion : currentFamilyQuestion}
        onRegister={handleDailyQuestionRegister}
        onShare={target => alert(`${target}에게 공유!`)}
        onRandomQuestion={category === 'parent' ? handleRandomParentQuestion : handleRandomFamilyQuestion}
      />
      
      {/* 한 번에 질문 풀기 버튼 */}
      <Card className="shadow-card border-primary/10">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <span role="img" aria-label="questions" className="text-3xl">📝</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">더 많은 질문에 답변해보세요</h3>
          <p className="text-sm text-muted-foreground mb-4">
            15개의 질문으로 나와 가족에 대해 더 깊이 알아보세요
          </p>
          <Button
            variant="gradient"
            size="lg"
            onClick={onStartQuestions}
            className="w-full flex items-center justify-center gap-2"
          >
            한 번에 질문 풀기
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
      
      <UnisonQuizCard
        question={currentUnisonQuiz.question}
        options={currentUnisonQuiz.options}
        onRegister={handleQuizRegister}
        onShare={target => { 
          setQuizShared(true); 
        }}
        onViewResult={() => {}}
        onRandomQuestion={handleRandomUnisonQuiz}
        shared={quizShared}
      />
      
      {/* 답변 기록 섹션 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">나의 답변 기록</h3>
        {questionRecords.map((record) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-card border-accent/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span role="img" aria-label={record.type === 'daily' ? 'daily' : 'quiz'}>
                    {record.type === 'daily' ? '🔮' : '🎲'}
                  </span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {record.date}
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">질문</p>
                    <p className="text-foreground font-medium text-sm leading-relaxed">{record.question}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">답변</p>
                    <p className="text-foreground text-sm leading-relaxed bg-muted/30 p-3 rounded-lg">{record.answer}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        
        {questionRecords.length === 0 && (
          <Card className="border-dashed border-muted-foreground/20">
            <CardContent className="py-12 text-center">
              <div className="text-4xl mb-4">💭</div>
              <p className="text-muted-foreground mb-2">아직 답변한 질문이 없어요</p>
              <p className="text-sm text-muted-foreground">함께 대화해보세요!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const renderCalendarTab = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // 현재 월의 첫째 날과 마지막 날
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // 캘린더 그리드 생성
    const calendarDays = [];
    const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;
    
    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startingDayOfWeek + 1;
      const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
      const isToday = isCurrentMonth && dayNumber === currentDate.getDate();
      
      // 해당 날짜의 일정 확인
      const dayDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
      const daySchedules = schedules.filter(s => s.date === dayDate);
      
      calendarDays.push({
        day: dayNumber,
        isCurrentMonth,
        isToday,
        date: dayDate,
        schedules: daySchedules
      });
    }
    
    // 월 이름 배열
    const monthNames = [
      '1월', '2월', '3월', '4월', '5월', '6월',
      '7월', '8월', '9월', '10월', '11월', '12월'
    ];
    
    // 요일 배열
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    
    const handleAddSchedule = () => {
      if (newSchedule.title && newSchedule.date) {
        const schedule = {
          id: Date.now().toString(),
          title: newSchedule.title,
          date: newSchedule.date,
          time: newSchedule.time,
          description: newSchedule.description
        };
        setSchedules(prev => [...prev, schedule]);
        setNewSchedule({ title: '', date: '', time: '', description: '' });
        setShowAddModal(false);
      }
    };
    
    const handleDayClick = (day: any) => {
      if (day.isCurrentMonth && day.schedules.length > 0) {
        setSelectedDate(day.date);
        setSelectedSchedules(day.schedules);
        setShowScheduleModal(true);
      }
    };

    return (
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">가족 캘린더</h1>
          <p className="text-muted-foreground">소중한 가족 일정을 확인해보세요</p>
        </div>

        {/* 월간 캘린더 */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-center flex-1">
                {monthNames[currentMonth]} {currentYear}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddModal(true)}
                className="ml-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day, index) => (
                <div
                  key={day}
                  className={`text-center text-sm font-medium py-2 ${
                    index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-muted-foreground'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
            
            {/* 캘린더 그리드 */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`aspect-square border border-border/20 rounded-lg p-1 text-center ${
                    !day.isCurrentMonth
                      ? 'bg-muted/20 text-muted-foreground/50'
                      : day.isToday
                      ? 'bg-primary text-white font-bold'
                      : 'hover:bg-accent/10 cursor-pointer'
                  }`}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="text-sm leading-none pt-1">
                    {day.isCurrentMonth ? day.day : ''}
                  </div>
                  {/* 일정 표시 */}
                  {day.isCurrentMonth && day.schedules.length > 0 && (
                    <div className="w-2 h-2 bg-accent rounded-full mx-auto mt-1"></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 가족 일정 카드들 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">이번 달 일정</h2>
          
          {schedules.length > 0 ? (
            schedules.map((schedule) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-card border-accent/10">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span role="img" aria-label="schedule">📅</span>
                          <h3 className="font-semibold text-foreground">{schedule.title}</h3>
                        </div>
                        {schedule.description && (
                          <p className="text-sm text-muted-foreground mb-1">{schedule.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>📅 {schedule.date}</span>
                          {schedule.time && <span>🕐 {schedule.time}</span>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="shadow-card border-dashed border-muted-foreground/20">
              <CardContent className="py-12 text-center">
                <div className="text-4xl mb-4">📅</div>
                <p className="text-muted-foreground mb-2">이번 달 일정이 없어요</p>
                <p className="text-sm text-muted-foreground">캘린더 상단의 + 버튼을 눌러 일정을 추가해보세요!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 일정 추가 모달 */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>일정 추가하기</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="일정 제목"
                  value={newSchedule.title}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, title: e.target.value }))}
                />
                <Input
                  type="date"
                  value={newSchedule.date}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, date: e.target.value }))}
                />
                <Input
                  type="time"
                  value={newSchedule.time}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, time: e.target.value }))}
                />
                <Input
                  placeholder="일정 설명 (선택사항)"
                  value={newSchedule.description}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, description: e.target.value }))}
                />
                
                {/* 예시 일정 버튼들 */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">자주 사용하는 일정</p>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewSchedule(prev => ({ 
                        ...prev, 
                        title: '부모님에게 안부전화하기',
                        description: '부모님 건강 상태 확인'
                      }))}
                      className="justify-start text-left h-auto py-2"
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">부모님에게 안부전화하기</span>
                        <span className="text-xs text-muted-foreground">부모님 건강 상태 확인</span>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewSchedule(prev => ({ 
                        ...prev, 
                        title: '자녀에게 연락하기',
                        description: '자녀의 하루 소식 듣기'
                      }))}
                      className="justify-start text-left h-auto py-2"
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">자녀에게 연락하기</span>
                        <span className="text-xs text-muted-foreground">자녀의 하루 소식 듣기</span>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewSchedule(prev => ({ 
                        ...prev, 
                        title: '부모님에게 아픈 데는 없는지 물어보기',
                        description: '부모님 건강 체크'
                      }))}
                      className="justify-start text-left h-auto py-2"
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">부모님에게 아픈 데는 없는지 물어보기</span>
                        <span className="text-xs text-muted-foreground">부모님 건강 체크</span>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewSchedule(prev => ({ 
                        ...prev, 
                        title: '가족 저녁 식사',
                        description: '가족과 함께하는 시간'
                      }))}
                      className="justify-start text-left h-auto py-2"
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">가족 저녁 식사</span>
                        <span className="text-xs text-muted-foreground">가족과 함께하는 시간</span>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewSchedule(prev => ({ 
                        ...prev, 
                        title: '부모님 생신',
                        description: '부모님 생신 축하'
                      }))}
                      className="justify-start text-left h-auto py-2"
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">부모님 생신</span>
                        <span className="text-xs text-muted-foreground">부모님 생신 축하</span>
                      </div>
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAddModal(false)}
                  >
                    취소
                  </Button>
                  <Button
                    variant="gradient"
                    className="flex-1"
                    onClick={handleAddSchedule}
                  >
                    추가하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 일정 상세 모달 */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>{selectedDate} 일정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedSchedules.map((schedule) => (
                  <div key={schedule.id} className="border rounded-lg p-3">
                    <h3 className="font-semibold">{schedule.title}</h3>
                    {schedule.description && (
                      <p className="text-sm text-muted-foreground mt-1">{schedule.description}</p>
                    )}
                    {schedule.time && (
                      <p className="text-xs text-muted-foreground mt-1">🕐 {schedule.time}</p>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowScheduleModal(false)}
                >
                  닫기
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  };

  const renderFamilyTab = () => {
    const handleJoinFamily = () => {
      if (joinCode.length === 6) {
        // 실제로는 서버에서 코드 검증
        const newMember: FamilyMember = {
          id: Date.now().toString(),
          name: '새로운 멤버',
          role: 'child',
          joinDate: new Date().toISOString().split('T')[0]
        };
        setFamilyMembers(prev => [...prev, newMember]);
        setJoinCode('');
        setShowJoinModal(false);
      }
    };



    const copyFamilyCode = async () => {
      try {
        await navigator.clipboard.writeText(familyCode);
      } catch (err) {
        // 복사 실패 시 조용히 처리
      }
    };

    const handleMemberClick = (member: FamilyMember) => {
      navigate(`/parent/${member.id}`);
    };

    const handlePhotoClick = (photo: any) => {
      setSelectedGalleryPhoto(photo);
      setShowPhotoModal(true);
    };



    return (
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">우리 가족</h1>
          <p className="text-muted-foreground">소중한 가족과 함께 성장해요</p>
        </div>

        {/* 가족 멤버 (작은 원형) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">가족 멤버</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {familyMembers.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className="relative cursor-pointer group"
                  onClick={() => handleMemberClick(member)}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center text-lg font-bold text-primary border-2 border-transparent hover:border-primary/30 transition-all duration-300">
                    {member.avatar ? (
                      <img 
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span>{member.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                    member.role === 'parent' ? 'bg-primary text-white' : 'bg-accent text-white'
                  }`}>
                    {member.role === 'parent' ? '부' : '자'}
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {member.name}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {familyMembers.length === 0 && (
              <div className="text-center w-full py-8">
                <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                <p className="text-muted-foreground mb-2">아직 가족 멤버가 없어요</p>
                <p className="text-sm text-muted-foreground">새 멤버를 추가해보세요!</p>
              </div>
            )}
          </div>
        </div>

        {/* 가족 갤러리 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">가족 갤러리</h2>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Upload className="h-4 w-4" />
                사진 추가
              </Button>
            </label>
          </div>
          
          {familyPhotos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {familyPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    className="shadow-card border-accent/10 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                    onClick={() => handlePhotoClick(photo)}
                  >
                    <div className="aspect-square bg-muted relative">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <h3 className="text-white text-sm font-medium">{photo.title}</h3>
                        <p className="text-white/80 text-xs">{photo.date}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="shadow-card border-dashed border-muted-foreground/20">
              <CardContent className="py-12 text-center">
                <div className="text-4xl mb-4">📸</div>
                <p className="text-muted-foreground mb-2">아직 가족 사진이 없어요</p>
                <p className="text-sm text-muted-foreground">소중한 추억을 공유해보세요!</p>
              </CardContent>
            </Card>
          )}
        </div>





        {/* 사진 상세 모달 */}
        {showPhotoModal && selectedGalleryPhoto && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-2xl">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPhotoModal(false)}
                className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
              >
                ✕
              </Button>
              <img
                src={selectedGalleryPhoto.url}
                alt={selectedGalleryPhoto.title}
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 text-white p-4 rounded-lg">
                <h3 className="font-semibold">{selectedGalleryPhoto.title}</h3>
                <p className="text-sm text-white/80">{selectedGalleryPhoto.date} • {selectedGalleryPhoto.uploadedBy}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSettingsTab = () => {
    return (
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">더보기</h1>
          <p className="text-muted-foreground">앱 설정과 정보를 확인해보세요</p>
        </div>
        
        {/* 앱 정보 */}
        <Card className="shadow-card border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span role="img" aria-label="app">📱</span>
              앱 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">앱 버전</span>
              <span className="text-sm font-medium">1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">개발자</span>
              <span className="text-sm font-medium">백남진</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">문의</span>
              <span className="text-sm font-medium text-primary">qorskawls12@naver.com</span>
            </div>
          </CardContent>
        </Card>

        {/* 피드백 */}
        <Card className="shadow-card border-accent/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span role="img" aria-label="feedback">💬</span>
              피드백 보내기
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              잘잇지 앱에 대한 의견이나 개선사항을 알려주세요!
            </p>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="피드백을 입력해주세요..."
              className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button 
              onClick={handleFeedbackSubmit}
              disabled={!feedbackText.trim()}
              className="w-full"
              variant="gradient"
            >
              피드백 보내기
            </Button>
            {showFeedbackSuccess && (
              <div className="text-center text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                피드백이 성공적으로 전송되었습니다! 감사합니다. 🙏
              </div>
            )}
          </CardContent>
        </Card>

        {/* 정식 서비스 출시 알림 */}
        <Card className="shadow-card border-secondary/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span role="img" aria-label="notification">🔔</span>
              정식 서비스 출시 알림받기
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              정식 서비스가 출시되면 알려드릴게요!
            </p>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button
                  variant={notificationType === 'email' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNotificationType('email')}
                  className="flex-1"
                >
                  이메일
                </Button>
                <Button
                  variant={notificationType === 'phone' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNotificationType('phone')}
                  className="flex-1"
                >
                  휴대폰
                </Button>
              </div>
              
              {notificationType === 'email' ? (
                <input
                  type="email"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  placeholder="이메일 주소를 입력해주세요"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              ) : (
                <input
                  type="tel"
                  value={notificationPhone}
                  onChange={(e) => setNotificationPhone(e.target.value)}
                  placeholder="휴대폰 번호를 입력해주세요 (예: 01012345678)"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              )}
            </div>
            
            <Button 
              onClick={handleNotificationSubmit}
              disabled={!((notificationType === 'email' ? notificationEmail : notificationPhone).trim())}
              className="w-full"
              variant="gradient"
            >
              알림 신청하기
            </Button>
            
            {showNotificationSuccess && (
              <div className="text-center text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                알림 신청이 완료되었습니다! 정식 출시 시 연락드릴게요. 🎉
              </div>
            )}
          </CardContent>
        </Card>

        {/* 이용약관 및 개인정보처리방침 */}
        <Card className="shadow-card border-muted-foreground/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span role="img" aria-label="legal">📋</span>
              법적 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="w-full justify-start text-left">
              <span role="img" aria-label="terms" className="mr-2">📄</span>
              이용약관
            </Button>
            <Button variant="ghost" className="w-full justify-start text-left">
              <span role="img" aria-label="privacy" className="mr-2">🔒</span>
              개인정보처리방침
            </Button>
            <Button variant="ghost" className="w-full justify-start text-left">
              <span role="img" aria-label="opensource" className="mr-2">📦</span>
              오픈소스 라이선스
            </Button>
          </CardContent>
        </Card>



        {/* 앱 정보 */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            © 2025 잘잇지. All rights reserved.
          </p>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'question', label: '질문', icon: BookOpen },
    { id: 'calendar', label: '일정', icon: Calendar },
    { id: 'family', label: '가족', icon: Users },
    { id: 'settings', label: '더보기', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeTab();
      case 'question':
        return renderQuestionTab();
      case 'calendar':
        return renderCalendarTab();
      case 'family':
        return renderFamilyTab();
      case 'settings':
        return renderSettingsTab();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background flex flex-col">
      <div className="flex-1 p-0 pb-16 max-w-md mx-auto w-full">
        {renderTabContent()}
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-10 max-w-md mx-auto w-full">
        <BottomNavBar value={activeTab} onChange={val => setActiveTab(val as TabType)} />
      </div>
      
      {/* 개인정보 수집 동의 모달 */}
      <PrivacyConsentModal
        isOpen={showPrivacyConsent}
        onAccept={handlePrivacyAccept}
        onDecline={handlePrivacyDecline}
      />
    </div>
  );
} 