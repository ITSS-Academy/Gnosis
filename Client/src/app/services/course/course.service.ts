import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from 'src/app/models/course.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private httpClient: HttpClient) {}
  getCourse(idToken: string) {
    return this.httpClient.get<Course[] | any>(
      environment.local_url + 'course',
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${idToken}`,
        }),
      }
    );
  }
  getReleasedCourse(idToken: string) {
    return this.httpClient.get<Course[] | any>(
      environment.local_url + 'course/released',
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${idToken}`,
        }),
      }
    );
  }
  getCourseById(idToken: string, id: string) {
    return this.httpClient.get<Course>(environment.local_url + `course/${id}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${idToken}`,
      }),
    });
  }
  create(idToken: string, course: Course) {
    return this.httpClient.post<Course>(
      environment.local_url + 'course',
      course,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${idToken}`,
        }),
      }
    );
  }

  update(idToken: string, course: Course) {
    return this.httpClient.put<Course>(
      environment.local_url + `course/${course._id}`,
      course,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${idToken}`,
        }),
      }
    );
  }

  remove(idToken: string, id: string) {
    return this.httpClient.delete<Course>(
      environment.local_url + `course/${id}`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${idToken}`,
        }),
      }
    );
  }

  buyCoure(idToken: string, courseId: string, userId: string) {
    return this.httpClient.put<any>(
      `http://localhost:3000/v1/course/${courseId}`,
      { userId },
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${idToken}`,
        }),
      }
    );
  }

  getCourseByUserId(idToken: string, userId: string) {
    return this.httpClient.get<Course[]>(
      `http://localhost:3000/v1/course/user/${userId}`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${idToken}`,
        }),
      }
    );
  }
}
