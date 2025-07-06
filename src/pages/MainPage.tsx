import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  BookOpen
} from "lucide-react";
import { HeaderSection } from "@/components/HeaderSection";
import { CategoryTabs } from "@/components/CategoryTabs";
import { DailyQuestionCard } from "@/components/DailyQuestionCard";
import { UnisonQuizCard } from "@/components/UnisonQuizCard";
import { BottomNavBar } from "@/components/BottomNavBar";

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
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: '나',
      role: 'child',
      joinDate: '2024-01-01'
    }
  ]);
  const [familyCode, setFamilyCode] = useState<string>('ABC123');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState<string>('');
  const [newMemberRole, setNewMemberRole] = useState<'parent' | 'child'>('child');
  const [showMemberDetail, setShowMemberDetail] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  
  // 가족 갤러리 상태
  const [familyPhotos, setFamilyPhotos] = useState<Array<{
    id: string;
    url: string;
    title: string;
    date: string;
    uploadedBy: string;
  }>>([
    {
      id: '1',
      url: '/placeholder.svg',
      title: '가족 여행',
      date: '2024-01-15',
      uploadedBy: '나'
    },
    {
      id: '2',
      url: '/placeholder.svg',
      title: '저녁 식사',
      date: '2024-01-14',
      uploadedBy: '나'
    }
  ]);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState<{
    id: string;
    url: string;
    title: string;
    date: string;
    uploadedBy: string;
  } | null>(null);

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
    alert(`답변 등록: ${answer}`);
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
    alert(`퀴즈 등록: ${answer}, 추가: ${extra}`);
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

  const renderHomeTab = () => (
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
        onShare={target => { setQuizShared(true); alert(`${target}에게 퀴즈 공유!`); }}
        onViewResult={() => alert('결과 확인!')}
        onRandomQuestion={handleRandomUnisonQuiz}
        shared={quizShared}
      />
    </div>
  );

  const renderQuestionTab = () => (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">질문 기록</h1>
        <p className="text-muted-foreground">나의 소중한 답변들을 확인해보세요</p>
      </div>
      
      <div className="space-y-4">
        {questionRecords.map((record) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-card border-primary/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span role="img" aria-label={record.type === 'daily' ? 'daily' : 'quiz'}>
                      {record.type === 'daily' ? '🔮' : record.id.startsWith('quiz-') ? '📝' : '🎲'}
                    </span>
                    {record.type === 'daily' ? '일일 질문' : 
                     record.id.startsWith('quiz-') ? '한 번에 질문 풀기' : '이구동성 퀴즈'}
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">{record.date}</span>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    record.category === 'parent' ? 'bg-accent/10 text-accent' :
                    'bg-growth/10 text-growth'
                  }`}>
                    {record.category === 'parent' ? '부모님에 대한 질문' : '가족에 대한 질문'}
                  </span>
                  {record.id.startsWith('quiz-') && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      챕터 {record.id.includes('chapter-') ? record.id.split('chapter-')[1].split('-')[0] : '1'}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">질문</p>
                    <p className="text-foreground font-medium">{record.question}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">답변</p>
                    <p className="text-foreground">{record.answer}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        
        {questionRecords.length === 0 && (
          <Card className="shadow-card border-dashed border-muted-foreground/20">
            <CardContent className="py-12 text-center">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-muted-foreground mb-2">아직 답변한 질문이 없어요</p>
              <p className="text-sm text-muted-foreground">홈에서 질문에 답변해보세요!</p>
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
        alert('가족에 성공적으로 참여했습니다!');
      } else {
        alert('6자리 코드를 정확히 입력해주세요.');
      }
    };

    const handleCreateFamily = () => {
      if (newMemberName.trim()) {
        const newMember: FamilyMember = {
          id: Date.now().toString(),
          name: newMemberName,
          role: newMemberRole,
          joinDate: new Date().toISOString().split('T')[0]
        };
        setFamilyMembers(prev => [...prev, newMember]);
        setNewMemberName('');
        setNewMemberRole('child');
        setShowCreateModal(false);
        alert('새로운 가족 멤버가 추가되었습니다!');
      } else {
        alert('이름을 입력해주세요.');
      }
    };

    const copyFamilyCode = async () => {
      try {
        await navigator.clipboard.writeText(familyCode);
        alert('가족 코드가 복사되었습니다!');
      } catch (err) {
        alert('코드 복사에 실패했습니다.');
      }
    };

    const handleMemberClick = (member: FamilyMember) => {
      setSelectedMember(member);
      setShowMemberDetail(true);
    };

    const handlePhotoClick = (photo: any) => {
      setSelectedGalleryPhoto(photo);
      setShowPhotoModal(true);
    };

    // 샘플 멤버별 질문 데이터 (실제로는 서버에서 가져옴)
    const getMemberQuestions = (memberId: string) => {
      // 실제로는 서버에서 해당 멤버의 질문 데이터를 가져옴
      // 현재는 빈 배열 반환
      return [];
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              멤버 추가
            </Button>
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
                    {member.name.charAt(0)}
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

        {/* 멤버 추가 모달 */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>새 멤버 추가</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">이름</label>
                  <Input
                    placeholder="멤버 이름"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">역할</label>
                  <div className="flex gap-2">
                    <Button
                      variant={newMemberRole === 'parent' ? 'gradient' : 'outline'}
                      className="flex-1"
                      onClick={() => setNewMemberRole('parent')}
                    >
                      부모
                    </Button>
                    <Button
                      variant={newMemberRole === 'child' ? 'gradient' : 'outline'}
                      className="flex-1"
                      onClick={() => setNewMemberRole('child')}
                    >
                      자녀
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCreateModal(false)}
                  >
                    취소
                  </Button>
                  <Button
                    variant="gradient"
                    className="flex-1"
                    onClick={handleCreateFamily}
                  >
                    추가하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 멤버 상세 모달 */}
        {showMemberDetail && selectedMember && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md max-h-[80vh] overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center text-sm font-bold">
                      {selectedMember.name.charAt(0)}
                    </div>
                    {selectedMember.name}의 답변
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMemberDetail(false)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="overflow-y-auto max-h-[60vh]">
                <div className="space-y-4">
                  {getMemberQuestions(selectedMember.id).map((q) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="border-accent/10">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span role="img" aria-label={q.type === 'daily' ? 'daily' : 'quiz'}>
                              {q.type === 'daily' ? '🔮' : '🎲'}
                            </span>
                            <span className="text-xs text-muted-foreground">{q.date}</span>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">질문</p>
                              <p className="text-foreground font-medium text-sm">{q.question}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">답변</p>
                              <p className="text-foreground text-sm">{q.answer}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  
                  {getMemberQuestions(selectedMember.id).length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">📝</div>
                      <p className="text-muted-foreground">아직 답변한 질문이 없어요</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>설정</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            앱 설정을 관리할 수 있습니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const tabs = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'question', label: '질문', icon: BookOpen },
    { id: 'calendar', label: '일정', icon: Calendar },
    { id: 'family', label: '가족', icon: Users },
    { id: 'settings', label: '설정', icon: Settings },
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
    </div>
  );
} 