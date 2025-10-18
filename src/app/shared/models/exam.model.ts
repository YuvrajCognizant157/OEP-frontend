export interface GetExamDataDTO {
  eid: number;
  name: string;
  description: string;
  totalMarks: number;
  duration: number;
  tids: string;
  displayedQuestions: number;
  attemptNo: number;
}

export interface SimplifiedExam {
  eid: number;
  examName: string;
  duration: number;
  totalMarks: number;
}

export interface StartExamQuestionDTO {
  approvalStatus: number;
  marks: number;
  options: string | optionDisplayType[];
  qid: number;
  questionName: string;
  type: string;
  questionReports: {
    qid: number;
    feedback: string;
    userId: number;
  };
  ParsedOptions : optionDisplayType[];
}

export interface StartExamResponseDTO {
  eid: number;
  totalMarks: number;
  duration: number;
  name: string;
  displayedQuestions: number;
  questions: StartExamQuestionDTO[]; // This now correctly uses the updated question DTO
}

export interface optionDisplayType {
  id: number;
  value: string;
}

export interface ReceivedResponseDTO {
  qid: number;
  Resp: string[];
}

export interface SubmittedExamDTO {
  EID: number;
  UserId: number;
  TotalMarks?: number;
  Duration?: number;
  Name?: string;
  DisplayedQuestions?: number;
  Responses: ReceivedResponseDTO[];
}

export interface AvailableExam {
  eid: number;
  name: string;
  description: string;
  totalMarks: number;
  duration: number;
  tids: string;
  displayedQuestions: number;
  attemptNo: number;
}

export interface ExamDetails {
  name: string;
  description: string;
  displayedQuestions: number;
  duration: number;
  tids: string;
}