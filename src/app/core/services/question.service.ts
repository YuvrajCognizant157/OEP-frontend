import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListQuestionsByExaminerId } from '../../shared/models/questions.model';

export interface AddQuestionPayload {
  type: string;
  question: string;
  options: string;
  tid: number;
  correctOptions: string[];
  approvalStatus: number;
}

export interface QuestionItem {
  Type: string;
  Question: string;
  Options: string;
  CorrectOptions: string[];
  ApprovalStatus: number;
}


export interface AddQuestionsByBatchPayload {
  tid: number;
  questions: QuestionItem[];
}


@Injectable({ providedIn: 'root' })
export class QuestionService {
  private apiUrl = 'https://localhost:44395/api/Questions';

  constructor(private http: HttpClient) { }

  // Method to add a single question
  addSingleQuestion(question: AddQuestionPayload, examId: number, userId: number): Observable<string> {
    const params = new HttpParams()
      .set('examId', examId.toString())
      .set('userId', userId.toString());

    return this.http.post<string>(`${this.apiUrl}/add-question`, question, { params, responseType: 'text' as 'json' });
  }

  // Method to add questions in a batch
  addMultipleQuestions(batch: AddQuestionsByBatchPayload, examId: number, userId: number): Observable<string> {
    const params = new HttpParams()
      .set('examId', examId.toString())
      .set('userId', userId.toString());

    return this.http.post<string>(`${this.apiUrl}/add-questions-by-tid-batch`, batch, { params, responseType: 'text' as 'json' });
  }

  getQuestionsByExaminer(examinerId: number, page: number, pageSize: number): Observable<{ results: ListQuestionsByExaminerId[]; count: number }> {
    const params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());

    return this.http.get<{ results: ListQuestionsByExaminerId[]; count: number }>(
        `${this.apiUrl}/get-questions-by-uid/${examinerId}`, // <- Use examinerId in the URL path
        { params }
    );
  }

  deleteQuestion(questionId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/delete-a-question/${questionId}`, { responseType: 'text' as 'json' });
  }

  getQuestionById(questionId: number): Observable<ListQuestionsByExaminerId> {
    return this.http.get<ListQuestionsByExaminerId>(`${this.apiUrl}/get-question-by-id/${questionId}`);
  }

  updateQuestion(questionId: number, questionData: AddQuestionPayload): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/update-question/${questionId}`, questionData, { responseType: 'text' as 'json' });
  }

  /**
   * Uploads an Excel file along with tid (required) and optional eid to the backend.
   * Matches the controller action: POST /import-excel expecting UploadQuestionsDto (File, Tid, Eid) from form.
   */
  uploadQuestionsExcel(file: File, eid?: number): Observable<any> {
    if (!file) {
      throw new Error('No file provided.');
    }

    // if (!tid || tid <= 0) {
    //   throw new Error('Tid (topic id) is required and must be > 0.');
    // }

    // Optional file type check
    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
        file.type !== 'application/vnd.ms-excel') {
      throw new Error('Invalid file type. Please upload an Excel file (.xlsx or .xls).');
    }

    const formDataToSend = new FormData();
    // Use property names that match the UploadQuestionsDto on the server (case-insensitive, but PascalCase is common)
    formDataToSend.append('File', file, file.name);
    // formDataToSend.append('Tid', tid.toString());
    if (eid != null) {
      formDataToSend.append('Eid', eid.toString());
    }

    return this.http.post<any>(`${this.apiUrl}/import-excel`, formDataToSend);
  }

  getQuestionDetailsById(questionId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-question-by-id/${questionId}`);
  }

  
}