import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";
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
  parentId?: string; // 부모님 ID 추가
  selectedRole?: 'mother' | 'father'; // 선택된 역할 추가
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
  "{어머님}이 좋아하시는 음식, 혹시 떠오르나요?",
  "{아버님} 생신은 언제인지 기억하고 계신가요?",
  "{어머님}이 좋아하는 색깔, 어떤 색이었나요?",
  "{아버님}은 어떤 일을 하고 계셨나요?",
  "{어머님}이 좋아하는 계절은 언제인가요?",
  "{아버님}의 취미는 무엇이었나요?",
  "{어머님}이 즐겨 보셨던 영화가 있다면요?",
  "{아버님}은 어떤 꿈을 가지고 계셨나요?",
  "{어머님}이 가장 좋아하시는 장소는 어디인가요?",
  "{아버님}에게 가장 소중했던 추억은 무엇일까요?",
  "{어머님}이 자주 들으셨던 노래가 있다면요?",
  "요즘 {아버님}이 가장 걱정하고 계신 일은 뭘까요?",
  "{어머님}이 좋아하시는 꽃, 기억나시나요?",
  "{아버님}이 자랑스러워했던 일이 있다면요?",
  "{어머님}이 즐겨 하시던 운동은 어떤 거였나요?",
  "{아버님}의 바람 중 하나, 떠오르는 게 있나요?",
  "{어머님}이 좋아하셨던 책이 있다면요?",
  "{아버님}이 이뤄내셨던 일 중 가장 자랑스러운 건 뭘까요?",
  "{어머님}이 자주 드시던 음료가 있다면요?",
  "요즘 {아버님}이 가장 고민하고 계신 건 뭘까요?",
  "{어머님}이 좋아하시는 동물이 있다면요?",
  "{아버님}을 정말 기쁘게 했던 일이 무엇이었을까요?",
  "{어머님}이 좋아하는 과일, 기억나시나요?",
  "{아버님}이 눈물을 보이셨던 일이 있다면요?",
  "{어머님}이 자주 만들어주시던 요리, 뭐가 떠오르세요?",
  "{아버님}이 품고 계신 희망이 있다면 어떤 걸까요?",
  "{어머님}이 빠지지 않고 챙겨보셨던 드라마가 있다면요?",
  "{아버님}이 최근에 고마워하셨던 일이 있다면요?",
  "{어머님}이 가보고 싶어 하셨던 여행지는 어디인가요?"
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
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [category, setCategory] = useState<'parent' | 'family'>('parent');
  const [quizShared, setQuizShared] = useState(false);
  // 잘잇지 앱 소개 모달 상태
  const [showAppIntroModal, setShowAppIntroModal] = useState(false);
  
  // 질문 기록 상태
  const [questionRecords, setQuestionRecords] = useState<QuestionRecord[]>(() => {
    const saved = localStorage.getItem('questionRecords');
    return saved ? JSON.parse(saved) : [];
  });
  
  // 현재 이구동성 퀴즈 상태 (랜덤 초기화)
  const [currentUnisonQuiz, setCurrentUnisonQuiz] = useState(() => {
    const randomIndex = Math.floor(Math.random() * unisonQuizQuestions.length);
    return unisonQuizQuestions[randomIndex];
  });
  
  // 오늘의 질문 세트 (10개씩 랜덤 선택)
  const [todayParentQuestions, setTodayParentQuestions] = useState<string[]>(() => {
    const saved = localStorage.getItem('todayParentQuestions');
    const savedDate = localStorage.getItem('todayParentQuestionsDate');
    const today = new Date().toISOString().split('T')[0];
    
    if (saved && savedDate === today) {
      return JSON.parse(saved);
    } else {
      // 30개 중 10개 랜덤 선택
      const shuffled = [...parentQuestions].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 10);
      localStorage.setItem('todayParentQuestions', JSON.stringify(selected));
      localStorage.setItem('todayParentQuestionsDate', today);
      return selected;
    }
  });

  const [todayFamilyQuestions, setTodayFamilyQuestions] = useState<string[]>(() => {
    const saved = localStorage.getItem('todayFamilyQuestions');
    const savedDate = localStorage.getItem('todayFamilyQuestionsDate');
    const today = new Date().toISOString().split('T')[0];
    
    if (saved && savedDate === today) {
      return JSON.parse(saved);
    } else {
      // 20개 중 10개 랜덤 선택
      const shuffled = [...familyQuestions].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 10);
      localStorage.setItem('todayFamilyQuestions', JSON.stringify(selected));
      localStorage.setItem('todayFamilyQuestionsDate', today);
      return selected;
    }
  });

  // 현재 질문 상태 (랜덤 초기화)
  const [currentParentQuestion, setCurrentParentQuestion] = useState(() => {
    const randomIndex = Math.floor(Math.random() * todayParentQuestions.length);
    return todayParentQuestions[randomIndex];
  });
  const [currentFamilyQuestion, setCurrentFamilyQuestion] = useState(() => {
    const randomIndex = Math.floor(Math.random() * todayFamilyQuestions.length);
    return todayFamilyQuestions[randomIndex];
  });
  
  // 현재 선택된 부모님 역할 상태
  const [currentParentRole, setCurrentParentRole] = useState<'mother' | 'father'>('mother');
  
  // 현재 질문의 등록 상태
  const [isCurrentQuestionRegistered, setIsCurrentQuestionRegistered] = useState(false);
  
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
    if (saved) {
      const parsed = JSON.parse(saved);
      // 저장된 데이터가 있고 "나"가 포함되어 있으면 그대로 사용
      if (Array.isArray(parsed) && parsed.some(member => member.name === '나')) {
        return parsed;
      }
    }
    // 저장된 데이터가 없거나 "나"가 없으면 초기 상태로 설정
    return [
      {
        id: '1',
        name: '나',
        role: 'child',
        joinDate: new Date().toISOString().split('T')[0]
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

  // 개인정보 동의 상태 (링크 접속 시에만 표시)
  const [showPrivacyConsent, setShowPrivacyConsent] = useState(() => {
    const hasConsented = localStorage.getItem('privacyConsent');
    return !hasConsented; // 동의하지 않았다면 모달 표시
  });

  // 가족 관리 모달 상태
  const [showFamilyManageModal, setShowFamilyManageModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<FamilyMember | null>(null);

  // 모달 상태 추가
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [emailError, setEmailError] = useState('');

  // 약관/방침 전문 텍스트
  const TERMS_TEXT = `잘잇지서비스 이용약관

제1조(목적)
이 약관은 잘잇지(이하 "회사")가 제공하는 '부모님 챙기기 앱 잘잇지' 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조(정의)
	1. "서비스"란 회사가 제공하는 가족 질문, 퀴즈, 캘린더 기능 등 모바일 또는 웹 기반의 서비스를 의미합니다.
	2. "이용자"란 본 약관에 따라 서비스를 이용하는 자를 말합니다.
	3. "회원"이란 서비스를 통해 개인정보를 등록한 자를 말합니다.

제3조(약관의 게시 및 변경)
회사는 본 약관을 앱 화면 또는 웹사이트에 게시하며, 관련 법령에 따라 변경할 수 있습니다.

제4조(서비스의 제공 및 변경)
	1. 회사는 아래와 같은 서비스를 제공합니다:
	• 가족 질문 및 답변 기록 서비스
	• 이구동성 퀴즈 기능
	• 가족 캘린더 일정 등록 기능
	2. 회사는 운영상 필요에 따라 서비스를 변경할 수 있습니다.

제5조(서비스의 이용시간 및 중단)
	1. 서비스는 연중무휴 24시간 이용할 수 있습니다.
	2. 다음의 경우 서비스 제공이 일시 중단될 수 있습니다:
	• 시스템 점검
	• 기술적 장애 발생
	• 회사의 사정으로 인한 변경 등

제6조(회원가입)
회원은 본 약관과 개인정보처리방침에 동의한 후 회원가입 절차를 통해 가입됩니다.

제7조(이용자의 의무)
이용자는 다음의 행위를 해서는 안 됩니다.
	1. 타인의 정보 도용
	2. 서비스 운영 방해 행위
	3. 기타 관련 법령 위반

제8조(회사의 책임제한)
	1. 회사는 천재지변, 기술적 장애 등 불가항력적 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.
	2. 회사는 이용자의 데이터 손실, 기기 문제 등 개인 환경에서 발생한 문제에 대해서도 책임지지 않습니다.

제9조(지적재산권)
서비스 내 모든 콘텐츠의 저작권은 회사 또는 정당한 권리를 가진 자에게 있으며, 무단 복제 및 배포를 금합니다.

제10조(약관의 해석 및 분쟁해결)
	1. 본 약관의 해석은 대한민국 법률에 따릅니다.
	2. 서비스와 관련한 분쟁은 민사소송법상의 관할법원에 제소합니다.`;

const PRIVACY_TEXT = `잘잇지 개인정보처리방침

1. 수집하는 개인정보 항목 및 방법
	• 수집 항목: 이름(또는 닉네임), 가족 구성 정보, 질문에 대한 답변, 기기 정보, 이용 로그 등
	• 수집 방법: 회원가입, 서비스 이용 중 자동 수집

2. 개인정보의 수집 및 이용 목적
회사는 다음의 목적을 위해 개인정보를 수집·이용합니다.
	• 가족 관리 서비스 제공
	• 질문/답변 기록 저장
	• 사용자 맞춤형 기능 제공
	• 서비스 개선 및 통계 분석

3. 개인정보 보유 및 이용기간
	• 회원 탈퇴 시 즉시 파기
	• 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관

4. 개인정보의 제3자 제공
회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
단, 법령에 따라 요청이 있는 경우 예외로 할 수 있습니다.

5. 개인정보의 파기 절차 및 방법
	• 파기 절차: 이용자가 회원탈퇴 시 즉시 삭제
	• 파기 방법: 전자적 파일 형태는 복구 불가능한 방식으로 삭제

6. 이용자 및 법정대리인의 권리와 행사방법
	• 자신의 개인정보 열람, 수정, 삭제를 언제든지 요청할 수 있습니다.
	• 만 14세 미만 아동의 경우 법정대리인의 동의를 받습니다.

7. 개인정보 보호책임자
	• 책임자: 백남진
	• 문의: qorskawls12@naver.com`;

// 이메일 유효성 검사 함수
const isValidEmail = (email: string) => email.includes('@');

  // 가족 관리 모달 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('familyMembers', JSON.stringify(familyMembers));
  }, [familyMembers]);

  // 질문 기록이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('questionRecords', JSON.stringify(questionRecords));
  }, [questionRecords]);

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
    const questionText = category === 'parent' ? getDisplayParentQuestion() : currentFamilyQuestion;
    
    // 중복 질문 확인 (같은 질문이 이미 답변되었는지 체크)
    const existingRecords = JSON.parse(localStorage.getItem('questionRecords') || '[]');
    const isDuplicate = existingRecords.some((record: QuestionRecord) => 
      record.question === questionText && 
      record.category === category &&
      record.parentId === (category === 'parent' ? getCurrentParentId() : undefined)
    );
    
    if (isDuplicate) {
      alert('이미 답변한 질문이에요! 중복된 질문 버튼을 눌러주세요.');
      return;
    }
    
    const newRecord: QuestionRecord = {
      id: Date.now().toString(),
      question: questionText,
      answer,
      category,
      date: new Date().toISOString().split('T')[0],
      type: 'daily',
      parentId: category === 'parent' ? getCurrentParentId() : undefined,
      selectedRole: category === 'parent' ? currentParentRole : undefined
    };
    setQuestionRecords(prev => {
      const newRecords = [newRecord, ...prev];
      // setState 후 다음 문제로 이동
      setTimeout(() => {
        if (category === 'parent') handleRandomParentQuestion();
        else handleRandomFamilyQuestion();
      }, 0);
      return newRecords;
    });
    
    // 등록 상태를 true로 설정
    setIsCurrentQuestionRegistered(true);
  };

  // 질문에서 역할 플레이스홀더를 실제 역할로 교체하는 함수
  const replaceRolePlaceholder = (question: string, role: 'mother' | 'father') => {
    const roleName = role === 'mother' ? '어머님' : '아버님';
    return question.replace(/\{어머님\}|\{아버님\}/g, roleName);
  };

  // 오늘 답변한 질문 수 계산
  const getTodayAnsweredCount = (category: 'parent' | 'family') => {
    const today = new Date().toISOString().split('T')[0];
    const existingRecords = JSON.parse(localStorage.getItem('questionRecords') || '[]');
    const todayRecords = existingRecords.filter((record: any) => 
      record.category === category && 
      record.type === 'daily' && 
      record.date === today
    );
    return todayRecords.length;
  };

  // 진행 상황 텍스트 생성
  const getProgressText = (category: 'parent' | 'family') => {
    const answered = getTodayAnsweredCount(category);
    const total = 10;
    return `(${answered}/${total})`;
  };

  // 모든 질문을 답변했는지 확인
  const isAllQuestionsAnswered = (category: 'parent' | 'family') => {
    const answered = getTodayAnsweredCount(category);
    return answered >= 10;
  };

  // 현재 부모님 질문을 표시용으로 가져오기
  const getDisplayParentQuestion = () => {
    return replaceRolePlaceholder(currentParentQuestion, currentParentRole);
  };

  // 현재 선택된 부모님 ID 가져오기 함수 (역할 기반)
  const getCurrentParentId = () => {
    const parentMembers = familyMembers.filter(m => m.role === 'parent');
    if (parentMembers.length === 0) return undefined;
    
    // 현재 선택된 역할에 맞는 부모님 찾기
    const targetRole = currentParentRole === 'mother' ? '어머니' : '아버지';
    const targetMember = parentMembers.find(m => m.name.includes(targetRole));
    
    return targetMember?.id || parentMembers[0].id; // 없으면 첫 번째 부모님
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
    setQuestionRecords(prev => {
      const newRecords = [newRecord, ...prev];
      setTimeout(() => {
        handleRandomUnisonQuiz();
      }, 0);
      return newRecords;
    });
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
    // localStorage에서도 이미 답변한 질문 확인
    const existingRecords = JSON.parse(localStorage.getItem('questionRecords') || '[]');
    const answeredQuestions = [
      ...questionRecords.filter(record => record.category === 'parent' && record.type === 'daily').map(record => record.question),
      ...existingRecords.filter((record: any) => record.category === 'parent' && record.type === 'daily').map((record: any) => record.question)
    ];
    
    // 현재 질문이 이미 답변되었다면 answeredQuestions에 추가
    if (isCurrentQuestionRegistered) {
      const currentQuestion = getDisplayParentQuestion();
      if (!answeredQuestions.includes(currentQuestion)) {
        answeredQuestions.push(currentQuestion);
      }
    }
    
    const newQuestion = getRandomQuestion(todayParentQuestions, answeredQuestions);
    setCurrentParentQuestion(newQuestion);
    
    // 랜덤으로 역할 선택 (어머님 또는 아버님)
    const randomRole = Math.random() < 0.5 ? 'mother' : 'father';
    setCurrentParentRole(randomRole);
    
    // 등록 상태 초기화
    setIsCurrentQuestionRegistered(false);
  };

  const handleRandomFamilyQuestion = () => {
    // localStorage에서도 이미 답변한 질문 확인
    const existingRecords = JSON.parse(localStorage.getItem('questionRecords') || '[]');
    const answeredQuestions = [
      ...questionRecords.filter(record => record.category === 'family' && record.type === 'daily').map(record => record.question),
      ...existingRecords.filter((record: any) => record.category === 'family' && record.type === 'daily').map((record: any) => record.question)
    ];
    
    // 현재 질문이 이미 답변되었다면 answeredQuestions에 추가
    if (isCurrentQuestionRegistered) {
      if (!answeredQuestions.includes(currentFamilyQuestion)) {
        answeredQuestions.push(currentFamilyQuestion);
      }
    }
    
    const newQuestion = getRandomQuestion(todayFamilyQuestions, answeredQuestions);
    setCurrentFamilyQuestion(newQuestion);
    
    // 등록 상태 초기화
    setIsCurrentQuestionRegistered(false);
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

  const handleDeleteMember = (id: string) => {
    setFamilyMembers(prev => prev.filter(m => m.id !== id));
    setMemberToDelete(null);
    setShowFamilyManageModal(false);
  };

  // location state에서 activeTab 받아오기
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // state 초기화
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

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
          데일리 카드로 부모님에 대해 더 깊이 알아보고,<br />
          지난 추억 기록해보기
        </p>
      </div>

      {/* 잘잇지 앱 소개 버튼 */}
      <div className="mt-8 flex justify-center">
        <Button
          variant="gradient"
          className="w-full max-w-xs py-4 text-lg font-semibold"
          onClick={() => setShowAppIntroModal(true)}
        >
          잘잇지 앱을 소개할게요!
        </Button>
      </div>

      {/* 잘잇지 앱 소개 모달 */}
      {showAppIntroModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">잘잇지 앱 소개</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowAppIntroModal(false)}>닫기</Button>
            </div>
            <div className="overflow-y-auto p-4 text-base flex-1 space-y-7">
              <section>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">잘잇지란? <span>🌱</span></h3>
                <p className="leading-relaxed text-[1.05em]">
                  잘잇지는 <b>부모님과의 소중한 대화와 추억</b>을 차곡차곡 담아두고, 가족 모두가 함께 웃고, 공감하며 성장할 수 있도록 도와주는 따뜻한 앱이에요.<br/>
                  <br/>
                  매일 주어지는 질문, 가족 퀴즈, 캘린더, 사진첩 기능을 통해 서로의 일상을 자연스럽게 잇고, 마음을 가까이 이어줘요.<br/>
                </p>
              </section>
              <section>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">주요 기능 <span>✨</span></h3>
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold flex items-center gap-2">오늘의 질문 <span>📝</span></div>
                    <div className="text-[0.98em] text-muted-foreground mt-1">하루에 하나, 부모님 또는 가족에 대한 질문에 답하며<br/>우리만의 이야기를 기록해보세요.</div>
                  </div>
                  <div>
                    <div className="font-semibold flex items-center gap-2">이구동성 퀴즈 <span>🎲</span></div>
                    <div className="text-[0.98em] text-muted-foreground mt-1">서로 얼마나 잘 알고 있을까?<br/>가족 모두가 함께 풀며 마음을 맞춰가는 퀴즈예요.</div>
                  </div>
                  <div>
                    <div className="font-semibold flex items-center gap-2">가족 캘린더 <span>📅</span></div>
                    <div className="text-[0.98em] text-muted-foreground mt-1">생일, 병원, 기념일 등<br/>가족의 중요한 일정을 함께 확인하고 챙겨보세요.</div>
                  </div>
                  <div>
                    <div className="font-semibold flex items-center gap-2">가족 갤러리 <span>📸</span></div>
                    <div className="text-[0.98em] text-muted-foreground mt-1">소중한 순간들을 사진으로 남기고,<br/>그 기억에 따뜻한 한 마디를 더해보세요.</div>
                  </div>
                </div>
              </section>
              <section>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">사용 방법 <span>👀</span></h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>홈에서 가족 멤버(부모님 등)를 추가해보세요.</li>
                  <li>'오늘의 질문'에 답하며 일상의 대화를 시작해보세요.</li>
                  <li>'이구동성 퀴즈'로 서로를 더 깊이 이해해보세요.</li>
                  <li>'캘린더'로 가족의 일정을 함께 관리해보세요.</li>
                  <li>'가족 갤러리'에 사진을 올려 추억을 함께 나눠보세요.</li>
                </ol>
              </section>
              <section>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">TIP <span>💡</span></h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>답변, 사진, 일정 등 모든 기록은 <b>내 기기</b>에 안전하게 저장돼요.</li>
                  <li>앱에 대한 의견은 언제든 ‘더보기' 탭에서 들려주세요.<br/>여러분의 이야기가 더 따뜻한 서비스를 만드는 힘이 됩니다.</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* 가족 멤버 섹션 */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground mb-4">부모님부터 추가해주세요!</h2>
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
            <h3 className="font-semibold text-sm mb-1">처음 오셨나요?</h3>
            <p className="text-xs text-muted-foreground">이 질문에 답 해보세요!</p>
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
                  disabled={familyMembers.some(member => member.name === '아버지')}
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
                    <div className="text-xs text-muted-foreground">
                      {familyMembers.some(member => member.name === '아버지') ? '이미 추가됨' : '부모님'}
                    </div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full h-14 text-left justify-start"
                  disabled={familyMembers.some(member => member.name === '어머니')}
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
                    <div className="text-xs text-muted-foreground">
                      {familyMembers.some(member => member.name === '어머니') ? '이미 추가됨' : '부모님'}
                    </div>
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
          question={category === 'parent' ? getDisplayParentQuestion() : currentFamilyQuestion}
          onRegister={handleDailyQuestionRegister}
          onShare={target => alert('아직 구현이 안되었어요!')}
          onRandomQuestion={category === 'parent' ? handleRandomParentQuestion : handleRandomFamilyQuestion}
          isRegistered={isCurrentQuestionRegistered}
          progressText={getProgressText(category)}
          isAllAnswered={isAllQuestionsAnswered(category)}
        />
      
      <UnisonQuizCard
        question={currentUnisonQuiz.question}
        options={currentUnisonQuiz.options}
        onRegister={handleQuizRegister}
        onShare={target => { 
          alert('아직 구현이 안되었어요!');
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
            <Card className="w-full max-w-md max-h-[90vh] flex flex-col overflow-y-auto">
              <CardHeader className="flex-shrink-0">
                <CardTitle>일정 추가하기</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
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
              </CardContent>
              <div className="flex-shrink-0 p-6 pt-0">
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
              </div>
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

        {/* 가족 관리 버튼 */}
        <div className="flex justify-end mb-2 pr-2">
          <Button variant="outline" size="sm" onClick={() => setShowFamilyManageModal(true)}>
            가족 관리 &gt;
          </Button>
        </div>

        {/* 가족 멤버 (작은 원형) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">가족 멤버</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {familyMembers.map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleMemberClick(member)}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full flex items-center justify-center text-sm font-bold text-accent mb-1 shadow-md border border-accent/30">
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
                <span className="text-xs text-foreground">{member.name}</span>
              </div>
            ))}
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
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Upload className="h-4 w-4 text-primary" />
              </div>
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

        {/* 가족 구성원 삭제 모달 */}
        {showFamilyManageModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-bold mb-4">가족 구성원 삭제</h2>
              <p className="mb-4 text-sm text-muted-foreground">삭제할 가족 구성원을 선택하세요.</p>
              <div className="space-y-2 mb-6">
                {familyMembers.filter(m => m.role !== 'child').map(member => (
                  <div key={member.id} className="flex items-center justify-between bg-muted rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-bold text-accent-foreground">{member.name.charAt(0)}</div>
                      )}
                      <span className="font-medium">{member.name}</span>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => setMemberToDelete(member)}>
                      삭제
                    </Button>
                  </div>
                ))}
                {familyMembers.filter(m => m.role !== 'child').length === 0 && (
                  <div className="text-center text-muted-foreground py-4">삭제할 가족이 없습니다.</div>
                )}
              </div>
              <Button variant="outline" className="w-full" onClick={() => setShowFamilyManageModal(false)}>
                닫기
              </Button>
            </div>
          </div>
        )}
        {/* 삭제 확인 모달 */}
        {memberToDelete && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-xs bg-white rounded-xl shadow-xl p-6">
              <h2 className="text-lg font-bold mb-4">정말 삭제할까요?</h2>
              <p className="mb-4 text-sm text-muted-foreground">{memberToDelete.name}님을 가족에서 삭제하시겠어요?</p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setMemberToDelete(null)}>취소</Button>
                <Button variant="destructive" className="flex-1" onClick={() => handleDeleteMember(memberToDelete.id)}>삭제</Button>
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
                <>
                  <input
                    type="email"
                    value={notificationEmail}
                    onChange={(e) => {
                      setNotificationEmail(e.target.value);
                      setEmailError(e.target.value && !isValidEmail(e.target.value) ? '올바른 이메일 형식이 아닙니다' : '');
                    }}
                    placeholder="이메일 주소를 입력해주세요"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                  {emailError && (
                    <div className="text-xs text-red-500 mt-1">{emailError}</div>
                  )}
                </>
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
              disabled={notificationType === 'email' ? !notificationEmail.trim() || !!emailError : !notificationPhone.trim()}
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

        {/* 앱 정보 */}
        <Card className="shadow-card border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span role="img" aria-label="app">📱</span>
              웹앱 정보
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

        {/* 이용약관 및 개인정보처리방침 */}
        <Card className="shadow-card border-muted-foreground/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span role="img" aria-label="legal">📋</span>
              법적 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="w-full justify-start text-left" onClick={() => setShowTermsModal(true)}>
              <span role="img" aria-label="terms" className="mr-2">📄</span>
              이용약관
            </Button>
            <Button variant="ghost" className="w-full justify-start text-left" onClick={() => setShowPrivacyModal(true)}>
              <span role="img" aria-label="privacy" className="mr-2">🔒</span>
              개인정보처리방침
            </Button>
            <Button variant="ghost" className="w-full justify-start text-left">
              <span role="img" aria-label="opensource" className="mr-2">📦</span>
              오픈소스 라이선스
            </Button>
          </CardContent>
        </Card>

        {/* 약관/방침 모달 */}
        {showTermsModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-bold">이용약관</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowTermsModal(false)}>닫기</Button>
              </div>
              <div className="overflow-y-auto p-4 text-sm whitespace-pre-line flex-1">{TERMS_TEXT}</div>
            </div>
          </div>
        )}
        {showPrivacyModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-bold">개인정보처리방침</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowPrivacyModal(false)}>닫기</Button>
              </div>
              <div className="overflow-y-auto p-4 text-sm whitespace-pre-line flex-1">{PRIVACY_TEXT}</div>
            </div>
          </div>
        )}
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