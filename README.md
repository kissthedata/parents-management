# 🌱 잘잇지 : 부모님, 가족과의 추억을 떠올리게 하는 서비스

**부모님을 챙기고, 가족과 더 가까워지는 연결 서비스**

- 나는 잘 알지만, 부모님과 가족에 대해 잘 모르고 있지 않나요? 10개의 데일리 질문을 통해서 그 때의 기억을 떠올려 적어봐요!

---

## ✨ 주요 기능

### 🏠 홈 화면
- **일일 질문**: 부모님과 가족에 대한 질문에 매일 답변
- **이구동성 퀴즈**: 객관식 퀴즈로 가족과의 공통점 확인

### 📝 질문 
- **자동 저장**: 한 번에 질문을 완료하면 답변 이력 탭에 자동 저장
- **유형별 구분 아이콘**
  - 🔮 일일 질문
  - 🎲 이구동성 퀴즈
- **카테고리 색상 구분**: 부모/가족 질문을 색상으로 구분

### 📅 가족 캘린더
- **월간 뷰**: 시각적으로 일정 확인
- **일정 추가**: 자주 쓰는 일정 템플릿 제공
- **가족 관련 일정 관리**
  - 병원 진료, 약 복용, 안부 연락, 기념일 등 관리

### 👨‍👩‍👧‍👦 답변 이력
- **질문 필터링**:내가 한 답변 필터링 기능으로 확인
---

## 🎮 사용 방법

1. **시작하기**: 부모님을 추가하기 (아버지, 어머니, 할머니, 할아버지)
2. **질문 답변**: 데일리 10개 질문 답변
3. **결과 확인**: 답변 완료 후, [답변 이력] 탭에서 기록 확인

---

## 🧑‍💻 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React + TypeScript + Vite |
| UI 프레임워크 | Tailwind CSS + Shadcn/ui |
| 애니메이션 | Framer Motion |
| 라우팅 | React Router |
| 상태관리 | React Hooks |
| DB/백엔드 | Supabase |
| 웹/앱 배포 | vercel |

---
## 프로젝트 구조
parents-management
├─ public
│  ├─ favicon.ico
│  ├─ placeholder.svg
│  └─ robots.txt
├─ src
│  ├─ App.css
│  ├─ App.tsx
│  ├─ index.css
│  ├─ main.tsx
│  ├─ vite-env.d.ts
│  ├─ data
│  │  └─ questions.ts
│  ├─ hooks
│  │  ├─ use-mobile.tsx
│  │  └─ use-toast.ts
│  ├─ lib
│  │  ├─ supabaseClient.ts
│  │  └─ utils.ts
│  ├─ pages
│  │  ├─ Album.tsx
│  │  ├─ Calendar.tsx
│  │  ├─ Gallery.tsx
│  │  ├─ Home.tsx
│  │  ├─ Index.tsx
│  │  ├─ MainPage.tsx
│  │  ├─ MyManagement.tsx
│  │  ├─ NotFound.tsx
│  │  ├─ Onboarding.tsx
│  │  ├─ ParentGallery.tsx
│  │  ├─ ParentManagement.tsx
│  │  ├─ ParentQuizSharePage.tsx
│  │  └─ Settings.tsx
│  └─ components
│     ├─ BottomNavBar.tsx
│     ├─ BottomNavigation.tsx
│     ├─ CategoryTabs.tsx
│     ├─ CompletionScreen.tsx
│     ├─ DailyQuestionCard.tsx
│     ├─ GrowthIllustration.tsx
│     ├─ HeaderSection.tsx
│     ├─ PhotoQuiz.tsx
│     ├─ PrivacyConsentModal.tsx
│     ├─ QuestionScreen.tsx
│     ├─ RoleSelection.tsx
│     ├─ UnisonQuizCard.tsx
│     └─ ui
│        ├─ accordion.tsx
│        ├─ alert-dialog.tsx
│        ├─ alert.tsx
│        ├─ aspect-ratio.tsx
│        ├─ avatar.tsx
│        ├─ badge.tsx
│        ├─ breadcrumb.tsx
│        ├─ button.tsx
│        ├─ calendar.tsx
│        ├─ card.tsx
│        ├─ carousel.tsx
│        ├─ chart.tsx
│        ├─ checkbox.tsx
│        ├─ collapsible.tsx
│        ├─ command.tsx
│        ├─ context-menu.tsx
│        ├─ dialog.tsx
│        ├─ drawer.tsx
│        ├─ dropdown-menu.tsx
│        ├─ form.tsx
│        ├─ hover-card.tsx
│        ├─ input-otp.tsx
│        ├─ input.tsx
│        ├─ label.tsx
│        ├─ menubar.tsx
│        ├─ navigation-menu.tsx
│        ├─ pagination.tsx
│        ├─ popover.tsx
│        ├─ progress.tsx
│        ├─ radio-group.tsx
│        ├─ resizable.tsx
│        ├─ scroll-area.tsx
│        ├─ select.tsx
│        ├─ separator.tsx
│        ├─ sheet.tsx
│        ├─ sidebar.tsx
│        ├─ skeleton.tsx
│        ├─ slider.tsx
│        ├─ sonner.tsx
│        ├─ switch.tsx
│        ├─ table.tsx
│        ├─ tabs.tsx
│        ├─ textarea.tsx
│        ├─ toast.tsx
│        ├─ toaster.tsx
│        ├─ toggle-group.tsx
│        ├─ toggle.tsx
│        ├─ tooltip.tsx
│        └─ use-toast.ts
├─ .env
├─ bun.lockb
├─ components.json
├─ eslint.config.js
├─ index.html
├─ netlify.toml
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ README.md
├─ tailwind.config.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vercel.json
└─ vite.config.ts


## 🚀 실행 방법
- 의존성 설치
npm install

- 개발 서버 실행
npm run dev

- 빌드
npm run build

- 바로 링크
https://jalitji.vercel.app/main

## 📸 주요 화면 구성

### 메인 페이지
- 잘잇지 앱 소개 버튼
- 오늘의 질문 (매일 새로운 질문)
- 이구동성 퀴즈 카드
- 캘린더

### 질문 화면
- 부모님과 가족에 대한 질문 각각 5개씩 총 10개의 데일리 질문 제공
- 이구동성 퀴즈: 가족도 그렇게 생각하는지 공유하여 확인 가능 (현재는 MVP라 공유 기능 미구현)

### 캘린더
- 이번 달 가족 일정 등록

### 답변 이력
- 답변 내용 확인
- `전체`, `부모님`, `가족`, `이구동성퀴즈`, `잘 모르겠어요` 필터링 기능으로 답변 확인 가능

---

## 🎨 디자인 특징

- **그라데이션 배경**: 따뜻하고 감성적인 분위기 연출
- **카드 기반 UI**: 깔끔하고 직관적인 사용자 경험
- **부드러운 애니메이션**: Framer Motion 사용
- **모바일 최적화**: 반응형 디자인 적용
---

## 📬 문의

프로젝트 관련 문의사항이 있으시면  
[Issues 탭](https://github.com/your-repo/issues) 또는 qoprskawls12@naver.com로 연락해주세요.  
함께 **잘잇지**를 더 따뜻한 서비스로 만들어가요 🌿
