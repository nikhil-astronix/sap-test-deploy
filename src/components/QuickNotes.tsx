import React, { useState, useRef, FC } from 'react';
import Image from 'next/image';

interface Evidence {
  imageUrl?: string;
  pdfUrl?: string;
}

interface QuickNotesProps {
  initialNotes: string;
  initialEvidenceDocs: any[];
}

const QuickNotes: FC<QuickNotesProps> = ({ initialNotes, initialEvidenceDocs }) => {
  const [notes, setNotes] = useState(initialNotes || '');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const handleFormatting = (command: string) => {
    document.execCommand(command, false);
  };

  const handleLinkClick = () => {
    setShowLinkInput(!showLinkInput);
    if (showLinkInput && linkUrl) {
      document.execCommand('createLink', false, linkUrl);
      setLinkUrl('');
    }
  };

  return (
    <div className="flex flex-col  bg-white rounded-xl shadow-md h-full border-t-2 border-[#7c3aed]"
    style={{
      borderTop: '5px solid',
      borderImage: 'linear-gradient(89.63deg, #2A7251 0.19%, #007778 32.84%, #2264AC 66.11%, #6C4996 100.07%) 1',
    }}>
      <div className="border-b border-[#EAECF0] p-2 ">
        <h2 className="text-sm text-center font-museo-sans-rounded-700 ">Quick Notes</h2>
      </div>

      <div className="flex flex-col p-4 h-full">
      {showLinkInput && (
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Enter URL"
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleLinkClick}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Insert
          </button>
        </div>
      )}

      {/* Editor */}
      <div
        contentEditable
        className="min-h-[200px] p-1  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        dangerouslySetInnerHTML={{
          __html: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea com.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea com.

abore et dolore magna aliqua. Ut quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea com. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
        }}
        
      />
       {/* Evidence Images Section */}
       <div className="mt-2">
        <div className="flex space-x-4">
          {/* Placeholder Image 1 */}
          <div className="relative w-28 h-20 rounded-lg overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
              alt="Classroom Placeholder"
              className="object-cover w-full h-full"
            />
            <button className="absolute top-1 right-1 bg-gray-200 rounded-full p-1 text-xs">✕</button>
          </div>
          {/* Placeholder Image 2 (PDF) */}
          <div className="relative w-28 h-20 rounded-lg overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full h-full">
              <span className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs mb-1">PDF</span>
              <span className="text-[10px] text-center text-gray-500">Rubric and PDF File</span>
            </div>
            <button className="absolute top-1 right-1 bg-gray-200 rounded-full p-1 text-xs">✕</button>
          </div>
        </div>
      </div>
      {/* Toolbar */}
      <div className="flex items-center w-auto mx-auto   mt-auto border border-gray-200 rounded-lg p-2 ">
        <button
          onClick={() => handleFormatting('bold')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>
        <button
          onClick={() => handleFormatting('italic')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Italic"
        >
          <span className="italic">I</span>
        </button>
        <button
          onClick={() => handleFormatting('underline')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Underline"
        >
          <span className="underline">U</span>
        </button>
        <button
          onClick={() => handleFormatting('strikeThrough')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Strike Through"
        >
          <span className="line-through">S</span>
        </button>
        <div className="w-px h-6 bg-gray-200 mx-2" />
        <button
          onClick={handleLinkClick}
          className="p-2 hover:bg-gray-100 rounded text-blue-500"
          title="Insert Link"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </button>
        <div className="w-px h-6 bg-gray-200 mx-2" />
        <button
          onClick={() => handleFormatting('justifyLeft')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Align Left"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 5h18v2H3V5zm0 6h12v2H3v-2zm0 6h18v2H3v-2z" />
          </svg>
        </button>
        <button
          onClick={() => handleFormatting('justifyCenter')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Align Center"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 5h18v2H3V5zm3 6h12v2H6v-2zm-3 6h18v2H3v-2z" />
          </svg>
        </button>
        <button
          onClick={() => handleFormatting('justifyRight')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Align Right"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 5h18v2H3V5zm6 6h12v2H9v-2zm-6 6h18v2H3v-2z" />
          </svg>
        </button>
        <button
          onClick={() => handleFormatting('justifyFull')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Justify"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z" />
          </svg>
        </button>
        <div className="w-px h-6 bg-gray-200 mx-2" />
        <button
          onClick={() => handleFormatting('insertUnorderedList')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Bullet List"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 6h2v2H4V6zm0 5h2v2H4v-2zm0 5h2v2H4v-2zm4-10h14v2H8V6zm0 5h14v2H8v-2zm0 5h14v2H8v-2z" />
          </svg>
        </button>
        <button
          onClick={() => handleFormatting('insertOrderedList')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Numbered List"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 6h2v2H4V6zm0 5h2v2H4v-2zm0 5h2v2H4v-2zm4-10h14v2H8V6zm0 5h14v2H8v-2zm0 5h14v2H8v-2z" />
          </svg>
        </button>
      </div>
      
      <div className="flex items-center justify-between text-gray-400 text-sm mt-4">
        <span>Saving...</span>
        <span>March 20, 2025, 12:24</span>
      </div>

      </div>
    </div>
  );
};

export default QuickNotes; 