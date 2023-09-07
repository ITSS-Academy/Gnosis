import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Quiz } from 'src/app/models/quiz.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(private http: HttpClient) {}

  getById(idToken: string, id: string) {
    return this.http.get<Quiz>(environment.host_url + 'quiz/' + id, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${idToken}`,
      }),
    });
  }
  create(idToken: string, quiz: Quiz) {
    return this.http.post<Quiz>(environment.host_url + 'quiz', quiz, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${idToken}`,
      }),
    });
  }
  update(idToken: string, quiz: Quiz) {
    return this.http.put<Quiz>(
      environment.host_url + `quiz/${quiz._id}`,
      quiz,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${idToken}`,
        }),
      }
    );
  }
}
