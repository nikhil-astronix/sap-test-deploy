import React from "react";
import CreateSchoolForm from "@/components/school/CreateSchoolForm";
import Header from "@/components/Header";

export default function NewSchoolPage() {
  return (
    <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-md min-h-full">
      <div className="max-w-3xl mx-auto h-auto">
        <Header
          title="Create School"
          description="Enter the details below to add a new school."
        />
        <CreateSchoolForm />
      </div>
    </div>
  );
}
