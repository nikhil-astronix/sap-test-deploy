import React, { useState } from 'react';

const QuickNotes = () => {
  const [notes, setNotes] = useState('');
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
    <div className="bg-white rounded-lg shadow p-4">
      <div className="border-b border-green-800 pb-2 mb-4">
        <h2 className="text-xl font-semibold">Quick Notes</h2>
      </div>

      {/* Toolbar */}
      <div className="flex items-center space-x-1 mb-4 border border-gray-200 rounded-lg p-2">
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
        className="min-h-[200px] p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        dangerouslySetInnerHTML={{
          __html: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea com.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea com.

abore et dolore magna aliqua. Ut quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea com. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
        }}
      />

      <div className="flex items-center justify-between text-gray-400 text-sm mt-4">
        <span>Saving...</span>
        <span>March 20, 2025, 12:24</span>
      </div>
    </div>
  );
};

export default QuickNotes; 