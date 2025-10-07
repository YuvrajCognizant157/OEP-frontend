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