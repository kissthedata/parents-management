import { format } from 'date-fns';

export function HeaderSection() {
  const today = format(new Date(), 'M월 d일 EEEE');
  return (
    <div className="py-6 px-4 flex flex-col items-center bg-gradient-to-b from-primary/10 to-background rounded-b-3xl mb-4">
      <div className="text-sm text-muted-foreground mb-1">{today}</div>
      <div className="text-xl font-bold mb-2">잘잇지, 오늘도 연결되는 하루 되세요</div>
      {/* 가족 일러스트: 임시 SVG */}
      <div className="w-24 h-16 flex items-center justify-center">
        <svg width="80" height="50" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="20" cy="30" rx="12" ry="15" fill="#E0E7FF" />
          <ellipse cx="60" cy="30" rx="12" ry="15" fill="#FDE68A" />
          <ellipse cx="40" cy="25" rx="14" ry="18" fill="#FCA5A5" />
          <circle cx="20" cy="20" r="7" fill="#6366F1" />
          <circle cx="60" cy="20" r="7" fill="#F59E42" />
          <circle cx="40" cy="12" r="8" fill="#F87171" />
        </svg>
      </div>
    </div>
  );
} 