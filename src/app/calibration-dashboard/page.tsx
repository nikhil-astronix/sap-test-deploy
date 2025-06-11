"use client";

const observationData = {
  date: "2025-06-10",
  school: "Greenfield Public School",
  observation_tool: "Standard Teaching Observation Tool v2.1",
  classroom_teacher_name: "Meena Sharma",
  classroom_course: "Science",
  classroom_grades: ["Grade 6", "Grade 7"],
  total_observers: 2,
  data: [
    {
      section_id: "section-1",
      section_name: "Teaching Practices",
      section_description:
        "Observations related to classroom teaching methods and engagement.",
      question_wise_data: [
        {
          question_id: "q1",
          question_text: "Was the lesson plan followed during the session?",
          question_sub_text:
            "Evaluator should confirm alignment with the submitted lesson plan.",
          is_mandatory: true,
          sub_questions: [
            {
              id: "sq1",
              text: "Lesson objectives visible?",
              is_mandatory: true,
            },
            {
              id: "sq2",
              text: "Activities conducted as planned?",
              is_mandatory: false,
            },
          ],
          response_analysis: [
            { response: "Yes", percentage: 60 },
            { response: "No", percentage: 30 },
            { response: "Partially", percentage: 10 },
          ],
          rows: [
            {
              id: "r1",
              question_response: "Yes",
              sub_question_responses: [["Yes"], ["Yes"]],
              respondent_name: "Priya Mehra",
              respondent_email: "priya@example.com",
              evidence_text: "Lesson plan and board work aligned.",
              evidence_docs: [
                {
                  name: "board.jpg",
                  mime_type: "image/jpeg",
                  s3_file_key: "evidence/board.jpg",
                },
              ],
            },
            {
              id: "r2",
              question_response: "No",
              sub_question_responses: [["No"], ["No"]],
              respondent_name: "Ravi Kumar",
              respondent_email: "ravi@example.com",
              evidence_text: "No mention of learning objectives.",
              evidence_docs: [],
            },
          ],
        },
        {
          question_id: "q2",
          question_text:
            "Was student engagement visible throughout the session?",
          question_sub_text:
            "Look for signs of active participation, Q&A, and attention.",
          is_mandatory: false,
          sub_questions: [
            { id: "sq3", text: "Hands raised?", is_mandatory: false },
            {
              id: "sq4",
              text: "Group discussion observed?",
              is_mandatory: false,
            },
          ],
          response_analysis: [
            { response: "Yes", percentage: 80 },
            { response: "No", percentage: 10 },
            { response: "Partially", percentage: 10 },
          ],
          rows: [
            {
              id: "r3",
              question_response: "Yes",
              sub_question_responses: [["Yes"], ["Yes"]],
              respondent_name: "Aarti Singh",
              respondent_email: "aarti@example.com",
              evidence_text:
                "Students answered questions and participated in activities.",
              evidence_docs: [],
            },
          ],
        },
      ],
    },
    {
      section_id: "section-2",
      section_name: "Classroom Environment",
      section_description:
        "Evaluates the physical and emotional environment in the classroom.",
      question_wise_data: [
        {
          question_id: "q3",
          question_text: "Was the classroom organized and clean?",
          question_sub_text:
            "This includes seating arrangement and cleanliness.",
          is_mandatory: true,
          sub_questions: [
            { id: "sq5", text: "Benches arranged?", is_mandatory: false },
            { id: "sq6", text: "Floor clean?", is_mandatory: false },
          ],
          response_analysis: [
            { response: "Yes", percentage: 90 },
            { response: "No", percentage: 5 },
            { response: "Partially", percentage: 5 },
          ],
          rows: [
            {
              id: "r4",
              question_response: "Yes",
              sub_question_responses: [["Yes"], ["Yes"]],
              respondent_name: "Deepak Joshi",
              respondent_email: "deepak@example.com",
              evidence_text: "Photos show tidy classroom.",
              evidence_docs: [
                {
                  name: "classroom.jpg",
                  mime_type: "image/jpeg",
                  s3_file_key: "evidence/classroom.jpg",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  notes:
    "Overall good session with active engagement and clean learning environment.",
  note_evidence_docs: [
    {
      name: "summary_note.pdf",
      mime_type: "application/pdf",
      s3_file_key: "evidence/summary_note.pdf",
    },
  ],
};
import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/calibration-dashboard/Navigation";
import { TabNavigation } from "@/components/calibration-dashboard/TabNavigation";
import { ObservationSection } from "@/components/calibration-dashboard/ObservationSection";
import { QuickNotes } from "@/components/calibration-dashboard/QuickNotes";
import { ObservationAPI } from "@/types";
// import { getCalibarationData } from "@/services/calibarationService";

export default function ObservationPage() {
  const [data, setData] = useState<ObservationAPI | null>(observationData);
  const [activeTab, setActiveTab] = useState(0);

  // useEffect(() => {
  //   console.log("Fetching calibration data...");
  //   const fetchData = async () => {
  //     const calibarationData = await getCalibarationData(
  //       "6843cfce046b7ab7173c525a",
  //       "68146cbb13016eb0e5bacb4d"
  //     );
  //     if (calibarationData.success) {
  //       setData(calibarationData.data);
  //     } else {
  //       console.error(
  //         "Failed to fetch calibration data:",
  //         calibarationData.error
  //       );
  //     }
  //   };
  //   fetchData();
  // }, []);

  const sections = data.data;
  const tabNames = [...sections.map((sec) => sec.section_name), "Quick Notes"];

  const isQuickNotesTab = activeTab === sections.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation info={data} />

      <TabNavigation
        tabs={tabNames}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="p-6">
        {isQuickNotesTab ? (
          <QuickNotes
            initialNotes={data.notes}
            initialDocs={data.note_evidence_docs}
          />
        ) : (
          <ObservationSection
            section={sections[activeTab]}
            totalObservers={data.total_observers}
          />
        )}
      </div>
    </div>
  );
}
