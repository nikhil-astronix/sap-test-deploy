// types.ts
export interface EvidenceDoc {
  name: string;
  mime_type: string;
  s3_file_key: string;
}
export interface Row {
  id: string;
  question_response: string;
  sub_question_responses: string[][];
  respondent_name: string;
  respondent_email: string;
  evidence_text: string;
  evidence_docs: EvidenceDoc[];
}
export interface ResponseAnalysis {
  response: string;
  percentage: number;
}
export interface SubQuestion {
  id: string;
  text: string;
  is_mandatory: boolean;
}
export interface Question {
  question_id: string;
  question_text: string;
  question_sub_text: string;
  is_mandatory: boolean;
  sub_questions: SubQuestion[];
  response_analysis: ResponseAnalysis[];
  rows: Row[];
}
export interface Section {
  section_id: string;
  section_name: string;
  section_description: string;
  question_wise_data: Question[];
}
export interface ObservationAPI {
  date: string;
  school: string;
  observation_tool: string;
  classroom_teacher_name: string;
  classroom_course: string;
  classroom_grades: string[];
  total_observers: number;
  data: Section[];
  notes: string;
  note_evidence_docs: EvidenceDoc[];
}
