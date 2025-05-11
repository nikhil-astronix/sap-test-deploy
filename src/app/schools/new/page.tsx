import React from "react";
import CreateClassroomForm from "@/components/classroom/CreateClassroomForm";

export default function NewSchoolPage() {
  return (
    <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-md h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto h-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Create School</h1>
        <p className="text-gray-600 mb-8 text-center">
          Fill the details below to add a new classroom.
        </p>
        <CreateClassroomForm />
      </div>
    </div>
  );
}
