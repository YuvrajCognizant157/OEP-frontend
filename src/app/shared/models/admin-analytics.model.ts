export interface TopExamDto {
 examId: number;
 examTitle: string;
 averageScore: number;
}
export interface AdminAnalytics {
 totalExams: number;
 totalQuestions: number;
 totalStudents: number;
 totalExaminers: number;
 blockedExaminers: number;
 topExams: TopExamDto[];
}