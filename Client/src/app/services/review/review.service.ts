import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Review } from 'src/app/models/Reivew.model';
@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private httpClient: HttpClient) { }
  getReviewByQuizId(idToken: string, id: string) {
    return this.httpClient.get<Review>(environment.local_url + `review/${id}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${idToken}`,
      }),
    });
  }
  create(idToken: string, review: Review) {
    return this.httpClient.post<Review>(
      environment.local_url + 'review/compare',
      review,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${idToken}`,
        }),
      }
    );
  }

  update(idToken: string, review: Review) {
    return this.httpClient.put<Review>(
      environment.local_url + `review/${review._id}`,
      review,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${idToken}`,
        }),
      }
    );
  }
}

