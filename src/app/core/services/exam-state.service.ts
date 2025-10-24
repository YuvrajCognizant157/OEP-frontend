import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExamStateService {
  private _examData = signal<{
    selectedAnswers: { qid: number; name:string;Resp: string[] }[];
    examId: number;
    userId: number;
    timeLeft: number;
  } | null>(null);

  examData = this._examData.asReadonly();

  setExamData(data: {
    selectedAnswers: { qid: number; name:string;Resp: string[] }[];
    examId: number;
    userId: number;
    timeLeft: number;
  }) {
    this._examData.set(data);
  }

  clearExamData() {
    this._examData.set(null);
  }
}