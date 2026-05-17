export type Tab = "global" | "mine" | "rewards";

const TABS: { id: Tab; label: string }[] = [
  { id: "global", label: "ประวัติทั่วโลก" },
  { id: "mine", label: "ประวัติของฉัน" },
  { id: "rewards", label: "ประวัติรางวัลของฉัน" },
];

type TabBarProps = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

export const TabBar = ({ activeTab, onTabChange }: TabBarProps) => (
  <div className="flex flex-row gap-2 px-4 py-3">
    {TABS.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`flex items-center justify-center px-3 py-2 h-8 rounded-[40px] border text-xs font-medium whitespace-nowrap transition-colors ${
          activeTab === tab.id
            ? "border-[#FF383C] text-[#FF383C]"
            : "border-[#979797] text-[#979797]"
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
