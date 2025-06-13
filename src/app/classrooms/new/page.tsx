import React from "react";
import CreateClassroomForm from "@/components/classroom/CreateClassroomForm";
import Header from "@/components/Header";

export default function NewClassroomPage() {
  return (
    <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-md min-h-full">
      <div className="max-w-3xl mx-auto h-auto">
        <Header
          title="Create Classroom"
          description="Enter the details below to add a new classroom."
        />
        <CreateClassroomForm />
      </div>
    </div>
  );
}
