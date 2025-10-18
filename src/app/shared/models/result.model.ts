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