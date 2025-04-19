import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addDays, addYears, subYears } from 'date-fns';
import { IoCalendarOutline } from 'react-icons/io5';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import clsx from 'clsx';

interface CustomCalendarProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  error?: string;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DAYS_OF_WEEK = [
  { id: 'sun', label: 'S' },
  { id: 'mon', label: 'M' },
  { id: 'tue', label: 'T' },
  { id: 'wed', label: 'W' },
  { id: 'thu', label: 'T' },
  { id: 'fri', label: 'F' },
  { id: 'sat', label: 'S' }
];

export const CustomCalendar: React.FC<CustomCalendarProps> = ({
  selectedDate,
  onChange,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [view, setView] = useState<'yearMonth' | 'dates'>('yearMonth');

  const handlePrevYear = () => {
    setCurrentYear(prev => prev - 1);
  };

  const handleNextYear = () => {
    setCurrentYear(prev => prev + 1);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentYear, monthIndex);
    setCurrentMonth(startOfMonth(newDate));
    setView('dates');
  };

  const handleDateSelect = (date: Date) => {
    onChange(date);
    setIsOpen(false);
    setView('yearMonth');
  };

  const toggleCalendar = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
    setView('yearMonth');
  };

  const handleBackToYearMonth = () => {
    setView('yearMonth');
  };

  const handleClear = () => {
    onChange(null);
    setIsOpen(false);
    setView('yearMonth');
  };

  const handleToday = () => {
    const today = new Date();
    onChange(today);
    setCurrentYear(today.getFullYear());
    setCurrentMonth(startOfMonth(today));
    setIsOpen(false);
    setView('yearMonth');
  };

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add padding days at start
  const startPadding = monthStart.getDay();
  const paddingStart = Array.from({ length: startPadding }, (_, i) => 
    addDays(monthStart, -(startPadding - i))
  );

  // Add padding days at end
  const endPadding = 6 - monthEnd.getDay();
  const paddingEnd = Array.from({ length: endPadding }, (_, i) => 
    addDays(monthEnd, i + 1)
  );

  const allDays = [...paddingStart, ...calendarDays, ...paddingEnd];

  // Group days into weeks
  const weeks = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  return (
    <div className="relative w-full">
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}
            readOnly
            className={`w-full px-4 py-2 bg-gray-50 rounded-md cursor-pointer ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            onClick={toggleCalendar}
            placeholder="dd/mm/yyyy"
          />
          <button
            onClick={toggleCalendar}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <IoCalendarOutline size={20} />
          </button>
          
          {isOpen && (
            <div className="absolute right-0 z-10 w-[300px] mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
              {view === 'yearMonth' ? (
                <>
                  <div className="flex items-center justify-between px-4 py-2 border-b">
                    <button onClick={handlePrevYear} className="p-1 hover:bg-gray-100 rounded-full">
                      <IoIosArrowBack size={20} />
                    </button>
                    <span className="text-lg font-medium">
                      {currentYear}
                    </span>
                    <button onClick={handleNextYear} className="p-1 hover:bg-gray-100 rounded-full">
                      <IoIosArrowForward size={20} />
                    </button>
                  </div>
                  <div className="p-4 grid grid-cols-3 gap-4">
                    {MONTHS.map((month, index) => (
                      <button
                        key={month}
                        onClick={() => handleMonthSelect(index)}
                        className={clsx(
                          'p-2 text-sm rounded-md text-center transition-colors',
                          currentMonth.getMonth() === index && currentYear === currentMonth.getFullYear()
                            ? 'bg-emerald-700 text-white'
                            : 'hover:bg-gray-100'
                        )}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between px-4 py-2 border-b">
                    <button onClick={handleBackToYearMonth} className="text-sm text-emerald-700 hover:text-emerald-800">
                      ← Back
                    </button>
                    <span className="text-lg font-medium">
                      {format(currentMonth, 'MMMM yyyy')}
                    </span>
                    <div className="w-10"></div>
                  </div>

                  <div className="p-2">
                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {DAYS_OF_WEEK.map((day) => (
                        <div key={day.id} className="text-center text-sm font-medium text-gray-600">
                          {day.label}
                        </div>
                      ))}
                    </div>

                    {weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="grid grid-cols-7 gap-1">
                        {week.map((day, dayIndex) => {
                          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                          const isToday = isSameDay(day, new Date());

                          return (
                            <button
                              key={dayIndex}
                              onClick={() => handleDateSelect(day)}
                              className={clsx(
                                'p-2 text-sm rounded-md text-center transition-colors',
                                !isCurrentMonth && 'text-gray-400',
                                isSelected && 'bg-emerald-700 text-white',
                                isToday && !isSelected && 'border border-emerald-700',
                                !isSelected && 'hover:bg-gray-100'
                              )}
                            >
                              {format(day, 'd')}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="flex justify-between p-2 border-t">
                <button
                  onClick={handleClear}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear
                </button>
                <button
                  onClick={handleToday}
                  className="px-3 py-1 text-sm text-emerald-600 font-medium hover:text-emerald-700"
                >
                  Today
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 