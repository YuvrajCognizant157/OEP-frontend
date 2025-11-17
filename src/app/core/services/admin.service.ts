import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExamApprovalStatus } from '../../shared/models/exam-approval.model';
import { QuestionReview } from '../../shared/models/question-review.model';
import { ExamFeedback } from '../../shared/models/exam-feedback.model';
import { ApproveTopic } from '../../shared/models/approve-topic.model';
import { BlockUserComponent } from '../../admin/block-user/block-user';
import { QuestionDetail, QuestionReport, QuestionReviewDTO } from '../../shared/models/admin.model';
import { environment } from '../../../environments/environment.prod';
export interface ToggleUserStatusDto
{
  userId:number;
  isActive:boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private backendUrl = environment.apiUrl;
  private readonly apiUrl = `${this.backendUrl}/api/Admin`;

  constructor(private http: HttpClient) {}

  /** ✅ Get list of exams pending approval */
  toggleBlockUser(userId: number): Observable<any> {
   const url = `${this.apiUrl}/blockuser/${userId}`;
   return this.http.put(url, null, { responseType: 'text' });}


   /** Fetch all users */

getAllUsers(): Observable<any[]> {

  return this.http.get<any[]>(`${this.apiUrl}/all-users`);

}

/** Toggle user active/deactivate */

toggleUserStatus(dto:ToggleUserStatusDto): Observable<any> {

  return this.http.post(`${this.apiUrl}/toggle-user-status`,dto, { responseType: 'text' });

}
 

  getAssignedExams(adminId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/approve-exam-list?userId=${adminId}`);
  }

 getExamQuestions(examId: number): Observable<any> {
 return this.http.get(`${this.apiUrl}/exam/${examId}/review`);
}
  approveOrRejectExam(ExamId: number, userId: number,Status: string): Observable<any> {
    const body={ExamId, userId, Status};
    return this.http.post(`${this.apiUrl}/approve-exam`, body);
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

  getExamFeedback(userId: number){
    return this.http.get(`${this.apiUrl}/exam-feedback-review?userId=${userId}`);
  }

  /** ✅ Add remarks */

  addAdminRemarks(examId: number, remark: string){

    const body={remarks:remark};
    return this.http.post(`${this.apiUrl}/add-adminremarks/${examId}`,body);

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

