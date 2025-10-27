export interface ListQuestionsByExaminerId{
    id: number;
    type: string;
    question: string;
}

// question-details.interface.ts (or similar)
// question-details.interface.ts

// Interface for the RAW data received directly from the API
export interface RawQuestionDetails {
  qid: number; // Matches your qid
  topics: {
    tid: number;
    topicName: string;
  };
  eid: number;
  examTitle: string;
  type: 'MCQ' | 'MSQ';
  question: string; // Matches your 'question' field
  marks: number;
  options: string; // 🔑 This is the stringified JSON
  correctOptions: string; // 🔑 This is the stringified JSON array
}

// Interface for the CLEAN, processed data used in the component
export interface QuestionDetails {
  questionId: number;
  questionText: string;
  options: { [key: string]: string };      // 🔑 Parsed object: { '1': '...', '2': '...' }
  correctOptions: string[];               // 🔑 Parsed array: ['3']
  topicId: number;
  topicName: string;
  examId: number;
  examTitle: string;
  type: 'MCQ' | 'MSQ';
  marks: number;
}