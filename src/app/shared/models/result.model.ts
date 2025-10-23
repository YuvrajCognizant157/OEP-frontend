export interface SimplifiedResult {
  userId?: number;
  eid: number;
  examName: string;
  attempts: number;
  score: number;
  takenOn: string;
  totalMarks: number;
}

export interface AttemptData {
  attempt: number; 
  score: number;
  takenOn: string; 
}


export interface ExamResultSummary {
  eid: number;
  examName: string;
  totalMarks: number;
  attemptsData: AttemptData[]; 
}

export interface RawResultDTO {
  userId: number;
  eid: number;
  examName: string;
  attempts: number;
  score: number;
  takenOn: string;
  totalMarks: number;
}
export interface Result {
 
  
  attempt : number;
  score: number;
  takenOn: Date;
}
export interface  ResultCalculationResponseDTO{
  eid: number;
  examName : string;
  totalMarks : number;
  success :boolean;
  message  : string;
  newResultCalculated : boolean;
  results : Result[];
}