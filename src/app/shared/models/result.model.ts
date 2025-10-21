export interface SimplifiedResult {
  userId?: number;
  eid: number;
  examName: string;
  attempts: number;
  score: number;
  takenOn: string;
  totalMarks: number;
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
  rid : number;
  userId : number;
  eid: number;
  attempts : number;
  score: number;
  createdAt: Date;
  updatedAt : Date;
}
export interface  ResultCalculationResponseDTO{
  success :boolean;
  message  : string;
  newResultCalculated : boolean;
  results : Result[];
}