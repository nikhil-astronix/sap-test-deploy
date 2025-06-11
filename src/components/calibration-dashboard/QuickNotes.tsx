import { EvidenceDoc } from "@/models/calibration";
import React, { useState } from "react";

export const QuickNotes = ({
  initialNotes,
  initialDocs,
}: {
  initialNotes: string;
  initialDocs: EvidenceDoc[];
}) => {
  const [notes, setNotes] = useState(initialNotes);

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Quick Notes</h2>
        <button className="text-gray-500 hover:text-gray-700">✏️</button>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full h-40 p-3 border rounded resize-none"
      />
      <div className="mt-4">
        {initialDocs.map((doc) => (
          <div key={doc.s3_file_key} className="mb-2 p-2 border rounded">
            {doc.name}
          </div>
        ))}
      </div>
    </div>
  );
};
