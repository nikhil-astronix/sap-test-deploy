import React from "react";
import CreateClassroomForm from "@/components/classroom/CreateClassroomForm";

export default function NewClassroomPage() {
  return (
    <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-md min-h-full">
      <div className="max-w-3xl mx-auto h-auto">
        <h1 className="text-2xl  mb-3 text-center">Create Classroom</h1>
        <p className="text-gray-600 mb-8 text-center">
          Enter the details below to add a new classroom.
        </p>
        <CreateClassroomForm />
      </div>
    </div>
  );
}
