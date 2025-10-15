import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TopicsService {
  private apiUrl = 'https://localhost:44395/api/Topics';

  constructor(private http: HttpClient) {}

  getTopics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-topic`);
  }
  getTopicById(topicId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-topic/${topicId}`);
  }
}
