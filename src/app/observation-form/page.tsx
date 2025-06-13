'use client';
import React, { useState, useEffect } from 'react';
import ObservationSession from '@/components/ObservationSession';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { updateObservation, getCompleteObservationWithTool } from "@/services/observationToolService";
import ObservationFormIntro from '@/app/observation-form/ObservationFormIntro';


const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function ObservationFormPage() {
  const [started, setStarted] = useState(false);
  const [observationData, setObservationData] = useState<any>(null);
  
  useEffect(() => {
    const callGetCompleteObservationWithTool = async () => {
      const observationId = "684888729994d5b9dc89af2b";
      const response = await getCompleteObservationWithTool(observationId);
      console.log("Get Complete Observation With Tool Response:", response);
      if (response.success && response.data) {
        setObservationData(response.data);
      }
    };

    callGetCompleteObservationWithTool();
  }, []);

  if (!observationData) return <div>Loading...</div>;

  return started ? (
    <ObservationSession
      date={observationData.date}
      school={observationData.school_name}
      observation_tool={observationData.observation_tool_name}
      total_observation_classrooms={observationData.total_observation_classrooms}
      observation_classrooms={observationData.classroom_grades}
      observation_classroom_teacher_name={observationData.classroom_teacher_name}
      total_observers={observationData}
      observation_tool_sections_with_responses={observationData.observation_tool_sections_with_responses || []}
      notes={observationData.notes || ''}
      note_evidence_docs={observationData.note_evidence_docs || []}
    />
  ) : (
    <ObservationFormIntro
      onGetStarted={() => setStarted(true)}
      date={observationData.date}
      school={observationData.school_name}
      observation_tool={observationData.observation_tool_name}
      observation_classrooms={observationData.classroom_grades}
      observation_classroom_teacher_name={observationData.classroom_teacher_name}
      total_observers={observationData}
    />
  );
} 