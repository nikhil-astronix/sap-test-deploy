import React, { useState } from 'react';
import { CustomCalendar } from '@/components/CustomCalendar';
import CustomTimePicker from '@/components/CustomTimePicker';

interface DateTimeStepProps {
  observationDate: Date | null;
  startTime: string | null;
  endTime: string | null;
  onDateChange: (date: Date | null) => void;
  onStartTimeChange: (time: string | null) => void;
  onEndTimeChange: (time: string | null) => void;
  onNext: () => void;
  onCancel: () => void;
}

const DateTimeStep = ({
  observationDate,
  startTime,
  endTime,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onNext,
  onCancel,
}: DateTimeStepProps) => {
  const [errors, setErrors] = useState<{
    date?: string;
    startTime?: string;
    endTime?: string;
  }>({});

  const validateAndNext = () => {
    const newErrors: {
      date?: string;
      startTime?: string;
      endTime?: string;
    } = {};

    if (!observationDate) {
      newErrors.date = 'Please select a date';
    }

    if (!startTime) {
      newErrors.startTime = 'Please select a start time';
    }

    if (!endTime) {
      newErrors.endTime = 'Please select an end time';
    }

    if (startTime && endTime) {
      // Parse times to compare them
      const parseTime = (timeStr: string) => {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let totalMinutes = hours * 60 + minutes;
        if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60;
        if (period === 'AM' && hours === 12) totalMinutes = minutes;
        return totalMinutes;
      };

      const startMinutes = parseTime(startTime);
      const endMinutes = parseTime(endTime);

      if (startMinutes >= endMinutes) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Observation Date</label>
          <CustomCalendar
            selectedDate={observationDate}
            onChange={(date) => {
              onDateChange(date);
              setErrors(prev => ({ ...prev, date: undefined }));
            }}
            error={errors.date}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-500">{errors.date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <CustomTimePicker
            value={startTime}
            onChange={(time) => {
              onStartTimeChange(time);
              setErrors(prev => ({ ...prev, startTime: undefined }));
            }}
            label=""
            error={errors.startTime}
        
          />
          {errors.startTime && (
            <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Time</label>
          <CustomTimePicker
            value={endTime}
            onChange={(time) => {
              onEndTimeChange(time);
              setErrors(prev => ({ ...prev, endTime: undefined }));
            }}
            label=""
            error={errors.endTime}
          />
          {errors.endTime && (
            <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={validateAndNext}
            className="px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateTimeStep; 