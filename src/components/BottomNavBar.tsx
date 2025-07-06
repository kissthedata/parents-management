import { Home, BookOpen, Calendar, Users, Settings } from 'lucide-react';

interface BottomNavBarProps {
  value: string;
  onChange: (val: string) => void;
}

const tabs = [
  { key: 'home', label: '홈', icon: Home },
  { key: 'question', label: '질문', icon: BookOpen },
  { key: 'calendar', label: '캘린더', icon: Calendar },
  { key: 'family', label: '우리 가족', icon: Users },
  { key: 'settings', label: '더보기', icon: Settings },
];

export function BottomNavBar({ value, onChange }: BottomNavBarProps) {
  return (
    <div className="border-t border-border/10 bg-background">
      <div className="max-w-2xl mx-auto">
        <div className="flex">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => onChange(tab.key)}
                className={`flex-1 flex flex-col items-center py-3 px-2 transition-colors ${
                  value === tab.key
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <IconComponent className="h-5 w-5 mb-1" />
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
} 