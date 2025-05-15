"use client";

import { useState } from 'react';
import { X } from 'lucide-react';
import { TableRow } from '../../AdminDashboardTable';

interface EditSessionProps {
  session: TableRow;
  onClose: () => void;
  onSave: () => void;
}

export default function EditSession({ session, onClose, onSave }: EditSessionProps) {
  // State for form fields
  const [date, setDate] = useState(session.date || '');
  const [startTime, setStartTime] = useState(session.startTime || '');
  const [endTime, setEndTime] = useState(session.endTime || '');
  const [observers, setObservers] = useState(session.observer || '');
  const [observationTool, setObservationTool] = useState(session.observationTool || '');
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically update the session data
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Session</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100" 
                value={session.school} 
                disabled 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-md" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-md" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)} 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-md" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)} 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observer(s)</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-md" 
                value={observers} 
                onChange={(e) => setObservers(e.target.value)} 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observation Tool</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md" 
                value={observationTool} 
                onChange={(e) => setObservationTool(e.target.value)} 
                required
              >
                <option value="">Select a tool</option>
                <option value="e³ Literacy FS">e³ Literacy FS</option>
                <option value="e³ Math">e³ Math</option>
                <option value="IPG Literacy">IPG Literacy</option>
                <option value="AAPS Literacy">AAPS Literacy</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button 
              type="button" 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}