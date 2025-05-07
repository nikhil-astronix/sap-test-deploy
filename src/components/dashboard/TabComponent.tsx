interface TabComponentProps {
  tabs: string[];
  colorClasses: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabComponent = ({ tabs, activeTab, onTabChange, colorClasses }: TabComponentProps) => {
  return (
    <div className="flex border-b">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          className={`w-full bg-gray-100 py-3 px-6 font-medium text-sm ${
            activeTab === tab
              ? `bg-${colorClasses[index]} text-white`
              : `text-gray-500 hover:text-${colorClasses[index]}`
          }`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabComponent;