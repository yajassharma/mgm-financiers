
interface Tab {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
}

export default function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
            active === tab.key
              ? "bg-white text-mgm-navy shadow-sm"
              : "text-mgm-muted hover:text-mgm-navy"
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                active === tab.key
                  ? "bg-mgm-gold/10 text-mgm-gold"
                  : "bg-gray-200 text-mgm-muted"
              }`}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
