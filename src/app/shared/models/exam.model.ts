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
export interface StartExamQuestionDTO{
  approvalStatus: number;
  marks:number;
  options: optionDisplayType[];
  qid:number;
  questionName : string;
  type: string;
  questionReports : {
    qid:number;
    feedback:string;
    userId:number;
  }
}
export interface StartExamResponseDTO{
  eid :number;
  totalMarks : number;
  duration: number;
  name: string;
  displayedQuestions: number;
  questions :StartExamQuestionDTO[];
};

export interface optionDisplayType{
  id:number;value:string;
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
