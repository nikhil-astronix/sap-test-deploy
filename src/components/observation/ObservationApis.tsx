import React from 'react';
import { updateObservation, getObservationToolById } from '@/services/observationToolService';

const sampleData = {
  notes: 'string',
  note_evidence_docs: [
    {
      name: 'string',
      mime_type: 'string',
      s3_file_key: 'string',
    },
  ],
  question_based_observations: [
    {
      id: 'string',
      section_id: 'string',
      question_id: 'string',
      is_sub_question: true,
      responses: ['string'],
      evidence_text: 'string',
      evidence_docs: [
        {
          name: 'string',
          mime_type: 'string',
          s3_file_key: 'string',
        },
      ],
    },
  ],
};

const observationId = '681bfc29657ea54c1e1d1b37';
const toolId = '681bf4f84b9837989720ca1e';

const ObservationApis = () => {
  const handleUpdateObservation = async () => {
    await updateObservation({
      observationId,
      operationType: 'UPDATE_OBSERVATION',
      data: sampleData,
    });
  };

  const handleGetObservationToolById = async () => {
    await getObservationToolById(toolId);
  };

  return (
    <div>
      <button
        onClick={handleUpdateObservation}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
      >
        Call Update Observation API
      </button>
      <button
        onClick={handleGetObservationToolById}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Get Observation Tool By ID
      </button>
    </div>
  );
};

export default ObservationApis; 