interface TabComponentProps {
  tabs: string[];
  colorClasses: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabComponent = ({ tabs, activeTab, onTabChange, colorClasses }: TabComponentProps) => {
  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          className={`w-full py-3 px-6 font-medium text-sm focus:outline-none transition-colors duration-200 ${
            activeTab === tab
              ? `bg-${colorClasses[index]} text-white`
              : `bg-gray-100 text-gray-500 hover:bg-gray-200`
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