import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExamApprovalStatus } from '../../shared/models/exam-approval.model';
import { QuestionReview } from '../../shared/models/question-review.model';
import { ExamFeedback } from '../../shared/models/exam-feedback.model';
import { ApproveTopic } from '../../shared/models/approve-topic.model';
import { BlockUserComponent } from '../../admin/block-user/block-user';
import { QuestionDetail, QuestionReport, QuestionReviewDTO } from '../../shared/models/admin.model';



@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly apiUrl = 'https://localhost:44395/api/Admin';

  constructor(private http: HttpClient) {}

  /** ✅ Get list of exams pending approval */
  toggleBlockUser(uid: number): Observable<any> {
    return this.http.post(
      'https://localhost:44395/api/Admin/block-users',
      { uid },
      { responseType: 'text' }
    );
  }

  getAssignedExams(adminId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/approve-exam-list?userId=${adminId}`);
  }

  getExamQuestions(examId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/Exam/${examId}/questions`);
  }

  approveOrRejectExam(eid: number, userId: number, action: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/approve-exam`, { eid, userId, action });
  }

  /** ✅ Get all reported questions */
  getReportedQuestions(adminId: number): Observable<QuestionReport[] | string> {
    return this.http.get<QuestionReport[] | string>(`${this.apiUrl}/reported-questions?adminId=${adminId}`);
  }
  getQuestionDetailsById(qid: number): Observable<QuestionDetail> {
    return this.http.get<QuestionDetail>(`${this.apiUrl}/review-questions/${qid}`);
  }
  reviewQuestion(payload: QuestionReviewDTO): Observable<string> {
    return this.http.post(`${this.apiUrl}/review-questions`, payload, { responseType: 'text' });
  }

  /** ✅ Block user */

  // blockUser(dto: BlockUser): Observable<string> {

  //   return this.http.post(`${this.apiUrl}/block-users`, dto, { responseType: 'text' });

  // }

  /** ✅ Fetch all feedback for an exam */

  getExamFeedback(examId: number): Observable<ExamFeedback[]> {
    return this.http.get<ExamFeedback[]>(`${this.apiUrl}/exam-feedback-review/${examId}`);
  }

  /** ✅ Add remarks */

  addAdminRemarks(examId: number, remarks: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/add-adminremarks/${examId}`, remarks, {
      headers: { 'Content-Type': 'application/json' },

      responseType: 'text',
    });
  }

  /** ✅ Get topics pending approval */

  getTopicsForApproval(userId: number): Observable<any> {
    return this.http.get<ApproveTopic[]>(`${this.apiUrl}/topic-list?userId=${userId}`);
  }

  /** ✅ Approve or reject topic */

  approveOrRejectTopic(topicId: number, userId: number, action: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/approve-topic`, { topicId, userId, action });
  }
}

