"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "@/components/observation/StepIndicator";
import DateTimeStep from "@/components/observation/steps/DateTimeStep";
import SchoolClassroomStep from "@/components/observation/steps/SchoolClassroomStep";
import AssignUsersStep from "@/components/observation/steps/AssignUsersStep";
import SessionReviewStep from "@/components/observation/steps/SessionReviewStep";
import { AnimatedContainer } from "@/components/ui/animated-container";
import Stepper from "@/components/classroom/Stepper";
import apiClient from "@/api/axiosInterceptor";

const steps = [
  {
    id: 0,
    label: "Date & Time Details",
    subtitle: "Select date and time",
  },
  {
    id: 1,
    label: "School & Classroom Selection",
    subtitle: "Choose school and classrooms",
  },
  {
    id: 2,
    label: "Assign Users",
    subtitle: "Select users and admin",
  },
  {
    id: 3,
    label: "Session Review",
    subtitle: "Review and schedule",
  },
];

// Mock data - replace with actual API calls
const mockUsers = [
  { id: "1", name: "John Doe", email: "johndoe@gmail.com" },
  { id: "2", name: "Priya Mehta", email: "priyamehta@gmail.com" },
];

const mockSchools = [{ id: "1", name: "Sampleschool123" }];

const mockClassrooms = [
  { id: "1", name: "SampleClassroom1" },
  { id: "2", name: "SampleClassroom2" },
  { id: "3", name: "SampleClassroom3" },
  { id: "4", name: "SampleClassroom4" },
  { id: "5", name: "SampleClassroom5" },
];

export default function ScheduleObservationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  // Form state
  const [observationDate, setObservationDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sessionAdmin, setSessionAdmin] = useState("");

  const getStepStatus = (index: number) => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "current";
    return "upcoming";
  };
  const stepperSteps = steps.map((step, index) => ({
    label: step.label,
    number: index + 1,
    status: getStepStatus(index) as "completed" | "current" | "upcoming",
  }));

  const handleNext = () => {
    // Validate current step before proceeding
    let isValid = false;

    switch (currentStep) {
      case 0:
        console.log("Validation values:", {
          observationDate,
          startTime,
          endTime,
          hasDate: Boolean(observationDate),
          hasStartTime: Boolean(startTime),
          hasEndTime: Boolean(endTime),
        });

        // Parse times to compare them
        const parseTime = (timeStr: string | null) => {
          if (!timeStr) return null;
          const [time, period] = timeStr.split(" ");
          const [hours, minutes] = time.split(":").map(Number);
          let totalMinutes = hours * 60 + minutes;
          if (period === "PM" && hours !== 12) totalMinutes += 12 * 60;
          if (period === "AM" && hours === 12) totalMinutes = minutes;
          return totalMinutes;
        };

        const startMinutes = parseTime(startTime);
        const endMinutes = parseTime(endTime);

        if (
          startMinutes !== null &&
          endMinutes !== null &&
          startMinutes >= endMinutes
        ) {
          console.log("End time must be after start time");
          return;
        }

        isValid =
          Boolean(observationDate) && Boolean(startTime) && Boolean(endTime);
        break;
      case 1:
        isValid = selectedSchool !== "" && selectedClassrooms.length > 0;
        break;
      case 2:
        isValid = selectedUsers.length > 0 && sessionAdmin !== "";
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      setDirection("forward");
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Validation failed");
    }
  };

  const handleBack = () => {
    setDirection("backward");
    // Remove the current step minus 1 from completed steps when going back
    setCompletedSteps(
      completedSteps.filter((step) => step !== currentStep - 1)
    );
    setCurrentStep(currentStep - 1);
  };

  // Function to check if a step is completed
  const isStepCompleted = (stepNumber: number) => {
    return completedSteps.includes(stepNumber);
  };

  // Function to get review data
  const getReviewData = () => {
    const adminUser = mockUsers.find((user) => user.id === sessionAdmin);
    const selectedUserDetails = mockUsers.filter((user) =>
      selectedUsers.includes(user.id)
    );
    const selectedClassroomDetails = mockClassrooms
      .filter((classroom) => selectedClassrooms.includes(classroom.id))
      .map((classroom) => classroom.name);
    const selectedSchoolName =
      mockSchools.find((school) => school.id === selectedSchool)?.name || "";

    return {
      observationDate: observationDate!,
      startTime,
      endTime,
      school: selectedSchoolName,
      classrooms: selectedClassroomDetails,
      observationTool: "Sample Tool", // Replace with actual tool selection
      users: selectedUserDetails.map((user) => ({
        name: user.name,
        email: user.email,
      })),
      sessionAdmin: adminUser
        ? { name: adminUser.name, email: adminUser.email }
        : { name: "", email: "" },
    };
  };

  const handleCancel = () => {
    router.push("/observation-sessions");
  };

  const handleSchedule = async () => {
    const reviewData = getReviewData();
    console.log("Scheduling data:", reviewData);

    // Format the data to match the API requirements
    const formattedData = {
      date: formatDate(reviewData.observationDate),
      start_time: formatTimeToISO(
        reviewData.startTime,
        reviewData.observationDate
      ),
      end_time: formatTimeToISO(reviewData.endTime, reviewData.observationDate),
      district: "string", // Add district ID if available
      school: reviewData.school,
      classrooms: reviewData.classrooms,
      observation_tool: reviewData.observationTool,
      users: reviewData.users.map((user) => user.email), // Assuming you want to use emails
      session_admin: reviewData.sessionAdmin.email, // Assuming you want to use email
    };
    try {
      const response = await apiClient.post(
        `/v1/observation_session/create_observation_session`,
        formattedData
      );

      if (response.status === 200) {
        console.log("Session scheduled successfully");
        router.push("/observation-sessions");
        return { success: true, data: response.data };
      } else {
        console.error("Failed to schedule session", formatDate);
        return { success: true, data: response.data };
        // Handle error (show notification, etc.)
      }
    } catch (error) {
      console.error("Error scheduling session:", error);
      // Handle error (show notification, etc.)
    }
  };

  // Helper function to format date to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper function to convert time string (like "08:52 AM") to ISO format
  const formatTimeToISO = (timeStr: string | null, date: Date): string => {
    if (!timeStr) return new Date().toISOString();

    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    // Convert to 24-hour format
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    // Create a new date with the time components
    const timeDate = new Date(date);
    timeDate.setHours(hours, minutes, 0, 0);

    return timeDate.toISOString();
  };
  return (
    <AnimatedContainer
      variant="fade"
      className="max-w-full  max-h-auto py-8 px-24 bg-white rounded-xl border p-6 shadow-md min-h-screen"
    >
      <AnimatedContainer variant="slide" custom={direction}>
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Schedule Observation Session
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Fill the details below to schedule a new observation session.
        </p>
      </AnimatedContainer>

      <AnimatedContainer
        variant="scale"
        custom={direction}
        className="w-full felx mb-8"
      >
        <div className="w-4/6 mx-auto">
          <Stepper steps={stepperSteps} />
        </div>
      </AnimatedContainer>

      <AnimatedContainer variant="fade" staggerItems={true} custom={direction}>
        {currentStep === 0 && (
          <DateTimeStep
            observationDate={observationDate}
            startTime={startTime}
            endTime={endTime}
            onDateChange={setObservationDate}
            onStartTimeChange={setStartTime}
            onEndTimeChange={setEndTime}
            onNext={handleNext}
            onCancel={handleCancel}
          />
        )}

        {currentStep === 1 && (
          <SchoolClassroomStep
            schools={mockSchools}
            classrooms={mockClassrooms}
            selectedSchool={selectedSchool}
            selectedClassrooms={selectedClassrooms}
            onSchoolChange={setSelectedSchool}
            onClassroomChange={setSelectedClassrooms}
            onNext={handleNext}
            onBack={handleBack}
            onCancel={handleCancel}
          />
        )}

        {currentStep === 2 && (
          <AssignUsersStep
            users={mockUsers}
            selectedUsers={selectedUsers}
            sessionAdmin={sessionAdmin}
            onUsersChange={setSelectedUsers}
            onSessionAdminChange={setSessionAdmin}
            onNext={handleNext}
            onBack={handleBack}
            onCancel={handleCancel}
          />
        )}

        {currentStep === 3 && (
          <SessionReviewStep
            data={getReviewData()}
            onSchedule={handleSchedule}
            onBack={handleBack}
            onCancel={handleCancel}
          />
        )}
      </AnimatedContainer>
    </AnimatedContainer>
  );
}
