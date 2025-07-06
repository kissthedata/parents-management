interface CategoryTabsProps {
  value: 'parent' | 'family';
  onChange: (val: 'parent' | 'family') => void;
}

const categories = [
  { key: 'parent' as const, label: '부모님에 대한 질문' },
  { key: 'family' as const, label: '가족에 대한 질문' },
];

export function CategoryTabs({ value, onChange }: CategoryTabsProps) {
  return (
    <div className="flex justify-center gap-2 my-4">
      {categories.map(cat => (
        <button
          key={cat.key}
          className={`px-4 py-2 rounded-full font-medium transition-colors text-sm
            ${value === cat.key ? 'bg-primary text-white shadow-glow' : 'bg-muted text-muted-foreground hover:bg-accent/30'}`}
          onClick={() => onChange(cat.key)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
} 