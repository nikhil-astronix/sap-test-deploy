interface NetworkTabComponentProps {
    tabs: string[];
    colorClasses: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
    sessionViewType?: string;
    setSessionViewType?: (type: string) => void;
    isDropdownOpen?: boolean;
    setIsDropdownOpen?: (isOpen: boolean) => void;
  }
  
  const NetworkTabComponent = ({ 
    tabs, 
    activeTab, 
    onTabChange, 
    colorClasses,
    sessionViewType = 'today',
    setSessionViewType = () => {},
    isDropdownOpen = false,
    setIsDropdownOpen = () => {}
  }: NetworkTabComponentProps) => {
    return (
      <div className="flex rounded-md">
        {tabs.map((tab, index) => {
          if (tab === 'Sessions') {
            return (
              <div key={tab} className={`relative w-full`}>
                <button
                  className={`w-full py-3 px-6 font-medium text-sm focus:outline-none transition-colors duration-200 ${
                    activeTab === tab
                      ? `bg-${colorClasses[index]} text-white`
                      : `bg-gray-100 text-gray-500 hover:bg-gray-200`
                  }`}
                  style={{
                    backgroundColor: activeTab === tab ? '#007778' : '',
                    color: activeTab === tab ? 'white' : ''
                  }}
                  onClick={() => onTabChange(tab)}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>
                      {sessionViewType === 'today' ? 'Today\'s Sessions' : 
                       sessionViewType === 'upcoming' ? 'Upcoming Sessions' : 'Past Sessions'}
                    </span>
                    <svg 
                      className="h-4 w-4" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDropdownOpen(!isDropdownOpen);
                      }}
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
                {isDropdownOpen && activeTab === 'Sessions' && (
                  <div className="absolute left-0 mt-1 w-56 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1">
                      <button
                        className={`${sessionViewType === 'today' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-4 py-2 text-sm w-full text-left`}
                        onClick={() => {
                          setSessionViewType('today');
                          setIsDropdownOpen(false);
                        }}
                      >
                        Today's Sessions
                      </button>
                      <button
                        className={`${sessionViewType === 'upcoming' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-4 py-2 text-sm w-full text-left`}
                        onClick={() => {
                          setSessionViewType('upcoming');
                          setIsDropdownOpen(false);
                        }}
                      >
                        Upcoming Sessions
                      </button>
                      <button
                        className={`${sessionViewType === 'past' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-4 py-2 text-sm w-full text-left`}
                        onClick={() => {
                          setSessionViewType('past');
                          setIsDropdownOpen(false);
                        }}
                      >
                        Past Sessions
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          }
          
          let backgroundColor = '';
          if (activeTab === tab) {
            if (tab === 'Districts') {
              backgroundColor = '#2264AC';
            } else if (tab === 'Observation Tools') {
              backgroundColor = '#6C4996';
            }
          }
          
          return (
            <button
              key={tab}
              className={`w-full py-3 px-6 font-medium text-sm focus:outline-none transition-colors duration-200 ${
                activeTab === tab
                  ? `bg-${colorClasses[index]} text-white`
                  : `bg-gray-100 text-gray-500 hover:bg-gray-200`
              }`}
              style={{
                backgroundColor: backgroundColor || (activeTab === tab ? colorClasses[index] : ''),
                color: activeTab === tab ? 'white' : ''
              }}
              onClick={() => onTabChange(tab)}
            >
              {tab}
            </button>
          );
        })}
      </div>
    );
  };
  
  export default NetworkTabComponent;