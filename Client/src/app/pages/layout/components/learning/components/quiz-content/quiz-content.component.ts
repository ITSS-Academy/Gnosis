import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiAlertService } from '@taiga-ui/core';
import { Subscription, combineLatest } from 'rxjs';
import { Review } from 'src/app/models/Reivew.model';
import { Quiz } from 'src/app/models/quiz.model';
import { AuthState } from 'src/app/ngrx/states/auth.state';
import { ReviewState } from 'src/app/ngrx/states/review.state';
import * as ReviewActions from 'src/app/ngrx/actions/review.actions';
import { ProfileState } from 'src/app/ngrx/states/profile.state';
import { Profile } from 'src/app/models/profile.model';
import * as ProfileActions from 'src/app/ngrx/actions/profile.actions';
import { Course } from 'src/app/models/course.model';
@Component({
  selector: 'app-quiz-content',
  templateUrl: './quiz-content.component.html',
  styleUrls: ['./quiz-content.component.less'],
})
export class QuizContentComponent implements OnInit, OnDestroy {
  quizForm: FormGroup = new FormGroup({
    _id: new FormControl({ value: '', disabled: true }, Validators.required),
    courseId: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    title: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
    total: new FormControl(0, Validators.required),
    duration: new FormControl(0, Validators.required),
    passCond: new FormControl(0, Validators.required),
  });

  review: Review = {
    _id: '',
    quizId: '',
    score: 0,
    profileId: '',
    test: [],
  };
  subscriptions: Subscription[] = [];
  quiz!: Quiz;
  idToken$ = this.store.select('auth', 'idToken');
  profile$ = this.store.select('profile', 'profile');
  review$ = this.store.select('review', 'reviewDetail');
  isUpdateSuccess$ = this.store.select('profile', 'isUpdateSuccess');
  completedCourseId = '';
  completedCourse: Course[] = [];
  isPassed: boolean = false;
  profileId: string = '';

  @Input('quiz')
  set quizInput(value: Quiz | null) {
    if (value != null) {
      //binding val
      this.quiz = value;
      this.quizForm.patchValue(value);
    } else {
      this.quiz = <Quiz>{};
    }
  }
  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private router: Router,
    private route: ActivatedRoute,

    private store: Store<{
      review: ReviewState;
      auth: AuthState;
      profile: ProfileState;
    }>
  ) {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
  ngOnInit(): void {
    this.profileId = this.route.snapshot.queryParamMap.get('uid') as string;
    console.log(this.profileId);

    this.subscriptions.push(
      combineLatest({
        idToken: this.idToken$,
        isUpdateSuccess: this.isUpdateSuccess$,
      }).subscribe((res) => {
        if (
          res.idToken != null &&
          res.idToken != undefined &&
          res.idToken != '' &&
          res.isUpdateSuccess == true
        ) {
          if (
            this.profileId != '' &&
            this.profileId != null &&
            this.profileId != undefined
          ) {
            this.store.dispatch(
              ProfileActions.get({ idToken: res.idToken, id: this.profileId })
            );
            console.log('get profile');
          }
        }
      }),
      combineLatest({
        idToken: this.idToken$,
        profile: this.profile$,
        review: this.review$,
      }).subscribe((res) => {
        if (
          res.review != null &&
          res.review != undefined &&
          res.review.score != undefined &&
          res.review.score != null &&
          res.idToken != null &&
          res.idToken != undefined &&
          res.idToken != '' &&
          res.profile != null &&
          res.profile != undefined &&
          res.profile.id != null &&
          res.profile.id != undefined &&
          res.profile.id != ''
        ) {
          this.review = res.review;
          if (
            this.review.score >=
            (this.quiz.total * this.quiz.passCond) / 100
          ) {
            this.isPassed = true;
            this.completedCourseId = this.router.url
              .split('/')[4]
              .split('?')[0];
            this.completedCourse = [...res.profile.completedCourse];
            let newProfile: Profile = {
              ...res.profile,
            };
            if (
              newProfile.completedCourse.some(
                (course) => course._id == this.completedCourseId
              )
            ) {
            } else {
              // console.log('update profile');
              newProfile.ongoingCourse = res.profile.ongoingCourse.filter(
                (ongoingCourseId) =>
                  ongoingCourseId._id != this.completedCourseId
              );
              newProfile.completedCourse = [
                ...newProfile.completedCourse,
                this.completedCourseId as any,
              ];
              console.log(newProfile);

              this.store.dispatch(
                ProfileActions.updateProfile({
                  idToken: res.idToken,
                  profile: newProfile,
                })
              );
            }
          } else {
            this.alerts
              .open("You haven't passed this quiz!!!", { status: 'error' })
              .subscribe();
          }
        }
      })
    );
  }

  toDoQuiz() {
    this.router.navigate([
      `/base/home/course/${this.quiz.courseId}/quiz/${this.quiz._id}`,
    ]);
  }
  toReview() {
    this.router.navigate([
      `/base/home/course/${this.quiz.courseId}/review/${this.quiz._id}`,
    ]);
  }
}
