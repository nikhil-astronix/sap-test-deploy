export const TabNavigation = ({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: string[];
  activeTab: number;
  onTabChange: (i: number) => void;
}) => {
  return (
    <div className="bg-[#F4F6F8] px-6 py-3 border-b border-gray-200 w-4/5 mx-auto">
      <div className="flex justify-center">
        <div className="inline-flex space-x-4 w-auto">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => onTabChange(i)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === i
                  ? "bg-[#2264AC] text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
