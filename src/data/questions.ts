export interface Question {
  id: number;
  chapter: number;
  questionNumber: number;
  text: string;
  options: string[];
}

export const mockQuestions: Question[] = [
  // Chapter 1: 자신에 대해 알아가기
  {
    id: 1,
    chapter: 1,
    questionNumber: 1,
    text: "가장 좋아하는 계절은 언제인가요?",
    options: ["봄 🌸", "여름 ☀️", "가을 🍂", "겨울 ❄️"]
  },
  {
    id: 2,
    chapter: 1,
    questionNumber: 2,
    text: "자유시간에 가장 하고 싶은 일은?",
    options: ["책 읽기 📚", "운동하기 💪", "친구와 놀기 🤸", "혼자만의 시간 🧘", "직접 입력..."]
  },
  {
    id: 3,
    chapter: 1,
    questionNumber: 3,
    text: "당신의 성격을 한 단어로 표현한다면?",
    options: ["활발함 ⚡", "차분함 🍵", "호기심 🤔", "친근함 🤗", "직접 입력..."]
  },
  {
    id: 4,
    chapter: 1,
    questionNumber: 4,
    text: "새로운 도전을 할 때 어떤 기분인가요?",
    options: ["신나요! 🎉", "걱정돼요 😥", "궁금해요 🧐", "자신있어요 😎", "직접 입력..."]
  },
  {
    id: 5,
    chapter: 1,
    questionNumber: 5,
    text: "가장 자랑스러운 나의 모습은?",
    options: ["친구를 도울 때 🤝", "열심히 공부할 때 ✏️", "새로운 걸 배울 때 ✨", "가족과 함께할 때 👨‍👩‍👧‍👦", "직접 입력..."]
  },

  // Chapter 2: 부모님에 대해 알아보기
  {
    id: 6,
    chapter: 2,
    questionNumber: 1,
    text: "아버지의 생신은?",
    options: ["월 선택", "일 선택"]
  },
  {
    id: 7,
    chapter: 2,
    questionNumber: 2,
    text: "부모님의 결혼기념일은?",
    options: ["월 선택", "일 선택"]
  },
  {
    id: 8,
    chapter: 2,
    questionNumber: 3,
    text: "아버지가 앓고 계신 지병이 있나요? (복수선택)",
    options: [
      "고혈압 🩸",
      "당뇨 🍬",
      "관절염 🦴",
      "심장 질환 ❤️",
      "수면장애 또는\n우울감 😔",
      "잘 모르겠어요 ❓",
      "없어요 ✅",
      "직접 입력..."
    ]
  },
  {
    id: 9,
    chapter: 2,
    questionNumber: 4,
    text: "부모님은 어떤 일을 하고 계신가요?",
    options: [
      "회사원 👨‍💼",
      "자영업 🏪",
      "농어업 🧑‍🌾",
      "공무원 🏛️",
      "교육직 👩‍🏫",
      "잘 모르겠어요 ❔",
      "직접 입력..."
    ]
  },
  {
    id: 10,
    chapter: 2,
    questionNumber: 5,
    text: "어머니는 어떤 취미를 가지고 계신가요? (복수선택 O)",
    options: [
      "등산 ⛰️",
      "수영 🏊‍♀️",
      "런닝 🏃‍♀️",
      "헬스 🏋️‍♀️",
      "필라테스 🧘‍♀️",
      "없어요 ✅",
      "잘 모르겠어요 ❓",
      "직접 입력..."
    ]
  },

  // Chapter 3: 가족에 대해 알아보기
  {
    id: 11,
    chapter: 3,
    questionNumber: 1,
    text: "가족과 가장 최근에 간 여행지는 어디인가요?",
    options: ["직접 입력...", "기억이 안나요 🤔"]
  },
  {
    id: 12,
    chapter: 3,
    questionNumber: 2,
    text: "가족이 다 함께 먹은 마지막 식사는 언제였나요?",
    options: ["직접 입력...", "기억이 안나요 🤔"]
  },
  {
    id: 13,
    chapter: 3,
    questionNumber: 3,
    text: "가족과 함께한 마지막 게임이나 놀이는 무엇인가요?",
    options: ["직접 입력...", "기억이 안나요 🤔"]
  },
  {
    id: 14,
    chapter: 3,
    questionNumber: 4,
    text: "가족이 함께 본 마지막 영화나 드라마는 무엇인가요?",
    options: ["직접 입력...", "기억이 안나요 🤔"]
  },
  {
    id: 15,
    chapter: 3,
    questionNumber: 5,
    text: "부모님에게 가장 감사했던 순간은 언제인가요?",
    options: ["직접 입력..."]
  }
];