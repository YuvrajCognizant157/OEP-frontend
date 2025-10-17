import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetExamDataDTO } from './shared/models/exam.model'; 
// import { AuthService } from '../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // Replace with your actual API base URL
  private readonly apiUrl = 'https://localhost:44395/api/Admin';

  constructor(private http: HttpClient) { }

  /**
   * Fetches the list of exams pending approval.
   * Corresponds to: [HttpPost("approve-exam-list")]
   */
  getExamsForApproval(): Observable<{ GetExamDataDTO: any }> {
    return this.http.get<{ GetExamDataDTO: any }>(`${this.apiUrl}/approve-exam-list`, {});
  }

  /**
   * Approves or rejects an exam.
   * / The action to perform: 'approve' or 'reject'.
   * Corresponds to: [HttpPost("approve-exam")]
   */
  approveOrRejectExam(examId: number, action: 'approve' | 'reject'): Observable<string> {
    const userId=1; // Replace with actual admin user ID after authservice extract userid from token
    const body = { eid: examId, action: action , uid: userId};
    return this.http.post(`${this.apiUrl}/approve-exam`, body, { responseType: 'text' });
  }

  /**
   * Gets all reported questions.
   * Corresponds to: [HttpGet("reported-questions")]
   */
  getReportedQuestions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reported-questions`);
  }
  
  /**
   * Reviews a reported question, approving or rejecting it.
   * he new status: 1 for approved, 0 for rejected.
   * Corresponds to: [HttpPost("review-questions")]
   */
  reviewReportedQuestion(questionId: number, status: 0 | 1): Observable<string> {
    const body = { qid: questionId, status: status };
    return this.http.post(`${this.apiUrl}/review-questions`, body, { responseType: 'text' });
  }

  /**
   * Blocks a user.
   * @param userId The ID of the user to block.
   * Corresponds to: [HttpPost("block-users")]
   */
  blockUser(userId: number): Observable<string> {
    const body = { uid: userId };
    return this.http.post(`${this.apiUrl}/block-users`, body, { responseType: 'text' });
  }

  /**
   * Fetches all feedback for a specific exam.
   * @ The ID of the exam.
   * Corresponds to: [HttpGet("exam-feedback-review/{eid}")]
   */
  getExamFeedback(examId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/exam-feedback-review/${examId}`);
  }

  /**
   * Adds administrative remarks to an exam.
   * @param examId The ID of the exam.
   * @param remarks The remarks to add.
   * Corresponds to: [HttpPost("add-adminremarks/{examId}")]
   */
  addAdminRemarks(examId: number, remarks: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/add-adminremarks/${examId}`, remarks, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
    });
  }

  /**
   * Gets topics submitted for approval by a specific user.
   * @param userId The ID of the user who approved them.
   * Corresponds to: [HttpGet("topic-list")]
   */
  getTopicsForApproval(userId: number): Observable<{ any:any }> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<{ any:any }>(`${this.apiUrl}/topic-list`, { params });
  }

  /**
   * Approves or rejects a topic.
   * @param topicId The ID of the topic.
   * @param userId The ID of the admin user.
   * Corresponds to: [HttpPatch("approve-topic")]
   */
  approveOrRejectTopic(topicId: number, userId: number): Observable<{ topicUpdateStatus: number }> {
    const params = new HttpParams()
      .set('topicId', topicId.toString())
      .set('userId', userId.toString());
    return this.http.patch<{ topicUpdateStatus: number }>(`${this.apiUrl}/approve-topic`, null, { params });
  }
}