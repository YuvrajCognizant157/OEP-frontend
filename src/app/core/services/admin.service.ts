import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApproveTopic } from '../../shared/models/approve-topic.model';
import { QuestionDetail, QuestionReport, QuestionReviewDTO } from '../../shared/models/admin.model';
import { EnvService } from './env.service';
export interface ToggleUserStatusDto
{
  userId:number;
  isActive:boolean;
}

@Injectable({providedIn: 'root'})
export class AdminService {

  private readonly baseUrl: string;

  constructor(private http: HttpClient, private env: EnvService) {
    this.baseUrl = `${this.env.apiUrl}/api/Admin`;
  }


  /** ✅ Get list of exams pending approval */
  toggleBlockUser(userId: number): Observable<any> {
    const url = `${this.baseUrl}/blockuser/${userId}`;
   return this.http.put(url, null, { responseType: 'text' });}


   /** Fetch all users */

getAllUsers(): Observable<any[]> {

  return this.http.get<any[]>(`${this.baseUrl}/all-users`);

}

/** Toggle user active/deactivate */

toggleUserStatus(dto:ToggleUserStatusDto): Observable<any> {

  return this.http.post(`${this.baseUrl}/toggle-user-status`,dto, { responseType: 'text' });

}
 

  getAssignedExams(adminId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/approve-exam-list?userId=${adminId}`);
  }

 getExamQuestions(examId: number): Observable<any> {
   return this.http.get(`${this.baseUrl}/exam/${examId}/review`);
}
  approveOrRejectExam(ExamId: number, userId: number,Status: string): Observable<any> {
    const body={ExamId, userId, Status};
    return this.http.post(`${this.baseUrl}/approve-exam`, body);
  }

  /** ✅ Get all reported questions */
  getReportedQuestions(adminId: number): Observable<QuestionReport[] | string> {
    return this.http.get<QuestionReport[] | string>(`${this.baseUrl}/reported-questions?adminId=${adminId}`);
  }
  getQuestionDetailsById(qid: number): Observable<QuestionDetail> {
    return this.http.get<QuestionDetail>(`${this.baseUrl}/review-questions/${qid}`);
  }
  reviewQuestion(payload: QuestionReviewDTO): Observable<string> {
    return this.http.post(`${this.baseUrl}/review-questions`, payload, { responseType: 'text' });
  }

  /** ✅ Block user */

  // blockUser(dto: BlockUser): Observable<string> {

  //   return this.http.post(`${this.env.apiUrl}/block-users`, dto, { responseType: 'text' });

  // }

  /** ✅ Fetch all feedback for an exam */

  getExamFeedback(userId: number){
    return this.http.get(`${this.baseUrl}/exam-feedback-review?userId=${userId}`);
  }

  /** ✅ Add remarks */

  addAdminRemarks(examId: number, remark: string){

    const body={remarks:remark};
    return this.http.post(`${this.baseUrl}/add-adminremarks/${examId}`,body);

  }

  /** ✅ Get topics pending approval */

  getTopicsForApproval(userId: number): Observable<any> {
    return this.http.get<ApproveTopic[]>(`${this.baseUrl}/topic-list?userId=${userId}`);
  }

  /** ✅ Approve or reject topic */

  approveOrRejectTopic(topicId: number, userId: number, action: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/approve-topic`, { topicId, userId, action });
  }
}

