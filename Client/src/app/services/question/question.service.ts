import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Question } from 'src/app/models/question.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private httpClient: HttpClient) { }
  getQuestionByQuizId(idToken: string, id: string) {
    return this.httpClient.get<Question[]>(environment.local_url + `question/${id}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${idToken}`,
      }),
    });
  }
  create(idToken: string, question: Question) {
    return this.httpClient.post<Question>(
      environment.local_url + 'question',
      question,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${idToken}`,
        }),
      }
    );
  }

  remove(idToken: string, id: string) {
    return this.httpClient.delete<Question>(
      environment.local_url + `question/${id}`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${idToken}`,
        }),
      }
    );
  }
}
