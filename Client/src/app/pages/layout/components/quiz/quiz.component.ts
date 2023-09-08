import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { TuiAlertService } from '@taiga-ui/core';
import { Observable, Subscription, interval, takeWhile } from 'rxjs';

import { AuthState } from 'src/app/ngrx/states/auth.state';
import { QuestionState } from 'src/app/ngrx/states/question.state';
import { ReviewState } from 'src/app/ngrx/states/review.state';
import * as QuestionAction from 'src/app/ngrx/actions/question.actions';
import * as ReviewActions from 'src/app/ngrx/actions/review.actions';
import { quizBank } from 'src/app/models/quizBank.model';
import { Quiz } from 'src/app/models/quiz.model';
import { Answer, Review } from 'src/app/models/Reivew.model';
import { Question } from 'src/app/models/question.model';
import { ProfileState } from 'src/app/ngrx/states/profile.state';
import { Profile } from 'src/app/models/profile.model';
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
            .open('Submiting ...', {
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
              .open('Submited success', {
                status: 'success',
              })
              .subscribe();
            this.store.dispatch(
              ReviewActions.get({
                idToken: this.idToken,
                id: this.questionList[0].quizId,
              })
            );
          }
        }),
      this.store
        .select('review', 'createErrorMessage')
        .subscribe((createErrorMessage) => {
          if (
            createErrorMessage != null &&
            createErrorMessage != undefined &&
            createErrorMessage != ''
          ) {
            this.alerts
              .open(createErrorMessage, {
                status: 'error',
              })
              .subscribe();
          }
        }),
      this.store.select('review', 'getErrorMessage').subscribe((val) => {
        if (val != null && val != undefined && val != '') {
          this.alerts
            .open(val, {
              status: 'error',
            })
            .subscribe();
        }
      }),

      this.store.select('review', 'isGetSuccess').subscribe((isGetSuccess) => {
        if (isGetSuccess) {
          this.router.navigate([`/base/home/course/${this.course._id}`], {
            queryParams: { isCompleted: true },
          });
          this.store.dispatch(ReviewActions.clearState());
        }
      }),
      this.store
        .select('review', 'getErrorMessage')
        .subscribe((getErrorMessage) => {
          if (
            getErrorMessage != null &&
            getErrorMessage != undefined &&
            getErrorMessage != ''
          ) {
            this.alerts
              .open(getErrorMessage, {
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
          });
        }
      }),

      this.question$.subscribe((value) => {
        if (value.length > 0) {
          this.questionList = [...value];
          this.options = this.questionList.map((question) => {
            return {
              quizBankId: (question as any).quizBank._id,
              answer: [],
            };
          });
          this.counter = this.questionList.length * 60;
        }
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
  selectOption(option: string, questIndex: number) {
    if (this.options[questIndex].answer.includes(option)) {
      this.options[questIndex].answer = this.options[questIndex].answer.filter(
        (ans) => ans != option
      );
    } else {
      this.options[questIndex] = {
        ...this.options[questIndex],
        answer: [...this.options[questIndex].answer, option],
      };
    }
  }

  idToken = '';
  submit() {
    const review: any = {
      quizId: this.questionList[0].quizId,
      profileId: this.profile.id,
      score: 0,
      test: this.options,
    };

    this.store.dispatch(
      ReviewActions.create({ idToken: this.idToken, review })
    );
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
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
