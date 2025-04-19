'use client';

import { useState } from 'react';
import { CustomCalendar } from '../components/CustomCalendar';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Custom Calendar Demo</h1>
        <CustomCalendar
          selectedDate={selectedDate}
          onChange={(date) => setSelectedDate(date || new Date())}
        />
      </div>
    </main>
  );
}
