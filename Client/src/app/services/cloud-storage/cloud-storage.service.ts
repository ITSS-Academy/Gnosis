import { Inject, Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import {
  StorageError,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { TuiAlertService } from '@taiga-ui/core';

@Injectable({
  providedIn: 'root',
})
export class CloudStorageService {
  constructor(
    private afApp: FirebaseApp,
    @Inject(TuiAlertService)
    private readonly alerts: TuiAlertService
  ) {}

  // 'file' comes from the Blob or File API
  async upLoadCourseImage(
    file: File | Blob,
    courseId: string
  ): Promise<string | StorageError> {
    const uploadTask = uploadBytesResumable(
      ref(
        getStorage(this.afApp),
        `courses/${courseId}/images/${Date.now().toString()}`
      ),
      file
    );

    return new Promise((res, rej) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.alerts
            .open('Upload is ' + progress + '% done', { status: 'info' })
            .subscribe();
          switch (snapshot.state) {
            case 'paused':
              this.alerts
                .open('Uploading paused', { status: 'warning' })
                .subscribe();
              break;
            case 'running':
              // this.alerts.open('Uploading ...', { status: 'info' }).subscribe();
              break;
          }
        },
        (error) => {
          this.alerts.open('Upload failed: ', { status: 'error' }).subscribe();
          res(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            this.alerts
              .open('Upload success', { status: 'success' })
              .subscribe();
            res(downloadURL);
          });
        }
      );
    });
  }

  async upLoadLessonImage(
    file: File | Blob,
    lessonId: string
  ): Promise<string | StorageError> {
    const uploadTask = uploadBytesResumable(
      ref(
        getStorage(this.afApp),
        `lessons/${lessonId}/images/${Date.now().toString()}`
      ),
      file
    );

    return new Promise((res, rej) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.alerts
            .open('Upload is ' + progress + '% done', { status: 'info' })
            .subscribe();
          switch (snapshot.state) {
            case 'paused':
              this.alerts
                .open('Uploading paused', { status: 'warning' })
                .subscribe();
              break;
            case 'running':
              // this.alerts.open('Uploading ...', { status: 'info' }).subscribe();
              break;
          }
        },
        (error) => {
          this.alerts.open('Upload failed: ', { status: 'error' }).subscribe();
          res(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            this.alerts
              .open('Upload success', { status: 'success' })
              .subscribe();
            res(downloadURL);
          });
        }
      );
    });
  }
}
