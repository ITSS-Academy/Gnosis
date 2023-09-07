import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { quizBank } from 'src/app/models/quizBank.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuizBankService {
  constructor(private http: HttpClient) {}

  add(idToken: string, quizBank: quizBank) {
    return this.http.post<any>(environment.host_url + 'quiz-bank', quizBank, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${idToken}`,
      }),
    });
  }

  update(idToken: string, quizBank: quizBank) {
    return this.http.put<any>(
      environment.host_url + `quiz-bank/${quizBank._id}`,
      quizBank,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${idToken}`,
        }),
      }
    );
  }
}
