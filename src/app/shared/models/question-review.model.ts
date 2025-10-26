export interface QuestionReview {
    qid: number;
    status: 0 | 1; // 0 for rejected, 1 for approved
}

export interface QuestionFeedback {
  qId: number;
  feedback: string;
  userId: number;
}