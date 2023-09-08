import { Course } from 'src/app/models/course.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profile } from 'src/app/models/profile.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private httpClient: HttpClient) {}

  updateProfile(idToken: string, profile: Profile) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${idToken}`,
    });
    return this.httpClient.put<any>(
      environment.host_url + `profile/${profile.id}`,
      profile,
      {
        headers,
      }
    );
  }

  create(profile: Profile, idToken: string) {
    return this.httpClient.post<any>(
      environment.host_url + `profile`,
      profile,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${idToken}`,
        }),
      }
    );
  }

  getById(id: string, idToken: string) {
    return this.httpClient.get<Profile>(
      environment.host_url + `profile/${id}`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${idToken}`,
        }),
      }
    );
  }
}
