import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lesson } from 'src/app/models/lesson.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  constructor(private http: HttpClient) {}

  getAllByCourseId(idToken: string, courseId: string) {
    return this.http.get<Lesson[]>(
      environment.host_url + 'lesson/course/' + courseId,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${idToken}`,
        }),
      }
    );
  }
  create(idToken: string, lesson: Lesson) {
    return this.http.post<any>(environment.host_url + 'lesson', lesson, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${idToken}`,
      }),
    });
  }
  update(idToken: string, lesson: Lesson) {
    return this.http.put<any>(
      environment.host_url + `lesson/${lesson._id}`,
      lesson,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${idToken}`,
        }),
      }
    );
  }
  remove(idToken: string, lessonId: string) {
    return this.http.delete<Lesson>(
      environment.host_url + `lesson/${lessonId}`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${idToken}`,
        }),
      }
    );
  }
}
