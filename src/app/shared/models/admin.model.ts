
export interface QuestionReviewDTO {
  qid: number;
  status: number;
  studentId:number;
}
export interface QuestionReport {
  qid: number;
  feedback: string;
  userId: number;
}

export interface QuestionDetail {
  qid: number;
  question1: string; 
  options: string;   
  correctOptions: string;
}