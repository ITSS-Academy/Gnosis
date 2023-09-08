import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { TuiAlertService } from '@taiga-ui/core';
import { Observable, Subscription, interval, takeWhile } from 'rxjs';

import { AuthState } from 'src/app/ngrx/states/auth.state';
import { QuestionState } from 'src/app/ngrx/states/question.state';
import { ReviewState } from 'src/app/ngrx/states/review.state';
import * as QuestionAction from 'src/app/ngrx/actions/question.actions';
import * as ReviewAction from 'src/app/ngrx/actions/review.actions';
import { quizBank } from 'src/app/models/quizBank.model';
import { Quiz } from 'src/app/models/quiz.model';
import { Answer, Review } from 'src/app/models/Reivew.model';
import { Question } from 'src/app/models/question.model';
import { ProfileState } from 'src/app/ngrx/states/profile.state';
import { Profile } from 'src/app/models/profile.model';
import * as ProfileAction from 'src/app/ngrx/actions/profile.actions';
import { idToken } from '@angular/fire/auth';
import { CourseState } from 'src/app/ngrx/states/course.state';
import { Course } from 'src/app/models/course.model';
import { QuizState } from 'src/app/ngrx/states/quiz.state';
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.less'],
})
export class QuizComponent implements OnInit, OnDestroy {
  @Input('review') review: null | Review = null;

  question$: Observable<Question[]> = this.store.select(
    'question',
    'questions'
  );
  review$: Observable<Review> = this.store.select('review', 'reviewDetail');
  idToken$: Observable<string> = this.store.select('auth', 'idToken');
  // quiz$: Observable<Quiz> = this.store.select('quiz', 'quizDetail');
  questionList: any[] = [];
  profile$: Observable<Profile> = this.store.select('profile', 'profile');

  questionTitle: string = '';
  counter: number = 0;
  timerSubscription: Subscription | undefined;
  formattedTime: string = '';
  course$: Observable<Course> = this.store.select('course', 'courseDetail');
  profile: Profile = <Profile>{};
  course: Course = <Course>{};
  question: Question = <Question>{};
  quiz: Quiz = <Quiz>{};
  ongoingCourse: Course[] = [];
  completedCourse: Course[] = [];

  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private router: Router,
    private route: ActivatedRoute,

    private store: Store<{
      question: QuestionState;
      review: ReviewState;
      auth: AuthState;
      profile: ProfileState;
      course: CourseState;
      quiz: QuizState;
    }>
  ) {}
  subscriptions: Subscription[] = [];

  quizBank: quizBank[] = [];
  backhome() {
    this.router.navigate(['/base/home']);
  }

  backcourse() {
    this.router.navigate(['/base/home/course']);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.store.select('review', 'isCreating').subscribe((isCreating) => {
        if (isCreating) {
          this.alerts
            .open('Create review ...', {
              status: 'success',
            })
            .subscribe();
        }
      }),
      this.store
        .select('review', 'isCreateSuccess')
        .subscribe((isCreateSuccess) => {
          if (isCreateSuccess) {
            this.alerts
              .open('Create review success', {
                status: 'success',
              })
              .subscribe();
          }
        }),
      this.store
        .select('review', 'createErrorMessage')
        .subscribe((createErrorMessage) => {
          if (createErrorMessage) {
            this.alerts
              .open(createErrorMessage, {
                status: 'error',
              })
              .subscribe();
          }
        }),

      this.route.paramMap.subscribe((params) => {
        const id = params.get('id');
        if (id) {
          this.idToken$.subscribe((value) => {
            if (value) {
              this.store.dispatch(
                QuestionAction.getAllByQuizId({ idToken: value, quizId: id })
              );
            }
            //console.log(id);
          });
        }
      }),

      this.question$.subscribe((value) => {
        this.questionList = [...value];
        this.counter = this.questionList.length * 60;
      }),

      this.profile$.subscribe((profile) => {
        if (profile != null && profile != undefined) {
          this.profile = profile;
        }
      }),

      this.course$.subscribe((course) => {
        if (course != null && course != undefined) {
          this.course = course;
        }
      }),

      this.store.select('auth', 'idToken').subscribe((val) => {
        if (val != '') {
          this.idToken = val;
        }
      })
    );
    const timer$ = interval(1000);
    this.timerSubscription = timer$
      .pipe(takeWhile(() => this.counter > 0))
      .subscribe(() => {
        this.counter--;
        this.formatTime();
      });

    this.formatTime();
  }

  options: Answer[] = [];
  selectOption(option: string) {
    for (let i = 0; i < this.questionList.length; i++) {
      // Iterate through the options for each question
      for (let j = 0; j < this.questionList[i].quizBank.options.length; j++) {
        // If the selected option is found
        if (this.questionList[i].quizBank.options[j] === option) {
          // Check if the options for the current quizBankId already exist in the `options` array
          const index = this.options.findIndex(
            (ele: Answer) =>
              ele.quizBankId === this.questionList[i].quizBank._id
          );
          if (index === -1) {
            this.options.push({
              answer: [option],
              quizBankId: this.questionList[i].quizBank._id,
            });
          } else {
            this.options[index].answer.push(option);
          }
        }
      }
    }
    // console.log(this.options);
  }
  completedCourseId: any = '';
  idToken = '';
  submit() {
    const review: Review = {
      _id: '',
      quizId: this.questionList[0].quizId,
      profileId: this.profile.id,
      score: 0,
      test: this.options,
    };
    this.idToken$.subscribe((value) => {
      if (value) {
        this.store.dispatch(ReviewAction.create({ idToken: value, review }));
      }
      this.router.navigate([`/base/home/course/${this.course._id}`]);
    });

    this.completedCourseId = this.course._id;
    let newProfile: any = {
      ...this.profile,
    };

    if (
      this.completedCourse.some(
        (ongoingCourse) => ongoingCourse._id == this.completedCourseId
      )
    ) {
      this.store.dispatch(
        ProfileAction.get({ id: this.profile.id, idToken: this.idToken })
      );
    } else {
      newProfile.ongoingCourse = this.profile.ongoingCourse.filter(
        (ongoingCourseId) => ongoingCourseId._id != this.completedCourseId
      );
      newProfile.completedCourse = [
        ...newProfile.completedCourse,
        this.completedCourseId,
      ];
      // console.log(newProfile);

      this.store.dispatch(
        ProfileAction.updateProfile({
          idToken: this.idToken,
          profile: newProfile,
        })
      );
      this.store.dispatch(
        ProfileAction.get({ id: this.profile.id, idToken: this.idToken })
      );
    }
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  formatTime(): void {
    const minutes = Math.floor(this.counter / 60);
    const seconds = this.counter % 60;
    this.formattedTime = `${this.formatNumber(minutes)}:${this.formatNumber(
      seconds
    )}`;
  }

  formatNumber(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }
}
