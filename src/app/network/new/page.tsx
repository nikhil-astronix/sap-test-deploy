"use client";
import React, { useState } from "react";

import CreateClassroomForm from "@/components/classroom/CreateClassroomForm";

export default function NewClassroomPage() {
  const [formData, setFormData] = useState({
    network: "",
  });

  return (
    <div className="container mx-auto bg-white rounded-lg min-h-screen overflow-y-auto">
      <div className="max-w-3xl mx-auto h-auto">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Create Network
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Enter the details below to add a new network.
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Network <span className="text-emerald-700">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter network name"
            value={formData.network}
            onChange={(e) =>
              setFormData({ ...formData, network: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <div className="flex justify-end mt-6 px-2 ">
            <button
              onClick={() => {}}
              className="bg-emerald-700 text-white px-6 py-2 rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-2 text-sm"
            >
              Add
            </button>
          </div>
        </div>
        {/* <CreateClassroomForm /> */}
      </div>
    </div>
  );
}
