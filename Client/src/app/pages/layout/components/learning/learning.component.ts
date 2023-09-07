import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiAlertService } from '@taiga-ui/core';
import { Subscription } from 'rxjs';
import { Lesson } from 'src/app/models/lesson.model';
import { LessonState } from 'src/app/ngrx/states/lesson.state';
import * as LessonAction from 'src/app/ngrx/actions/lesson.actions';
import { AuthState } from 'src/app/ngrx/states/auth.state';
import { CourseState } from 'src/app/ngrx/states/course.state';
import * as CourseActions from 'src/app/ngrx/actions/course.actions';
import { Course } from 'src/app/models/course.model';
import { QuizState } from 'src/app/ngrx/states/quiz.state';
import { Quiz } from 'src/app/models/quiz.model';
import * as QuizAcitons from 'src/app/ngrx/actions/quiz.actions';

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.less'],
})
export class LearningComponent implements OnInit, OnDestroy {
  isGettingCourse = false;
  isGettingLessons = false;
  course!: Course;
  quiz!: Quiz;
  lessonList: Lesson[] = [];
  course$ = this.store.select('course', 'courseDetail');
  lessonList$ = this.store.select('lesson', 'lessons');
  selectedLesson: Lesson | null = null;
  selectedQuiz: Quiz | null = null;
  subscriptions: Subscription[] = [];
  items = [
    {
      caption: 'Home',
      routerLink: '/base/home',
    },
  ];

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
  ngOnInit(): void {
    this.subscriptions.push(
      this.store.select('auth', 'idToken').subscribe((idToken) => {
        if (idToken) {
          console.log(this.router.url.split('/')[4]);
          this.store.dispatch(
            LessonAction.getAllByCourseId({
              idToken,
              courseId: this.router.url.split('/')[4],
            })
          );
          this.store.dispatch(
            CourseActions.getCourseDetail({
              idToken: idToken,
              id: this.router.url.split('/')[4],
            })
          );
          this.store.dispatch(
            QuizAcitons.get({ idToken, id: this.router.url.split('/')[4] })
          );
        }
      }),
      this.store.select('lesson', 'isGetSuccess').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Get lessons success', { status: 'success' })
            .subscribe();
        }
      }),
      this.store.select('lesson', 'isGetting').subscribe((val) => {
        this.isGettingLessons = val;
      }),
      this.store.select('lesson', 'lessons').subscribe((val) => {
        if (val != null && val != undefined && val.length > 0) {
          this.lessonList = [...val];
          this.lessonList.sort((a, b) => {
            return a.ordinalNum - b.ordinalNum;
          });
        }
        console.log('lessonList: ', this.lessonList);
      }),
      this.store.select('lesson', 'getMessError').subscribe((val) => {
        if (val) {
          this.alerts.open(val, { status: 'error' }).subscribe();
        }
      }),
      this.store.select('course', 'isGetLoading').subscribe((val) => {
        this.isGettingCourse = val;
      }),
      this.store.select('course', 'courseDetail').subscribe((val) => {
        if (val) {
          this.course = val;
          console.log('course: ', this.course);
        }
      }),
      this.store.select('course', 'getErrMess').subscribe((val) => {
        if (val) {
          this.alerts.open(val, { status: 'error' }).subscribe();
        }
      }),
      this.store.select('quiz', 'quiz').subscribe((val) => {
        if (val) {
          this.quiz = val;
          console.log('quiz: ', this.quiz);
        }
      }),
      this.store.select('quiz', 'isGetSuccess').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Get quiz success', { status: 'success' })
            .subscribe();
        }
      }),
      this.store.select('quiz', 'getMessError').subscribe((val) => {
        if (val) {
          this.alerts.open(val, { status: 'error' }).subscribe();
        }
      })
    );
  }
  constructor(
    private router: Router,
    @Inject(TuiAlertService)
    private readonly alerts: TuiAlertService,
    private store: Store<{
      auth: AuthState;
      course: CourseState;
      quiz: QuizState;
      lesson: LessonState;
    }>
  ) {
    this.items.push({
      caption: 'Current',
      routerLink: this.router.url,
    });
  }

  selectLesson(lesson: Lesson) {
    if (this.selectedLesson?._id === lesson._id) {
      this.alerts
        .open('Lesson already chosen !!!', { status: 'warning' })
        .subscribe();
      return;
    }
    this.selectedLesson = lesson;
    this.selectedQuiz = null;
  }
  selectQuiz() {
    if (this.selectedQuiz != null) {
      this.alerts
        .open('Quiz already chosen !!!', { status: 'warning' })
        .subscribe();
      return;
    }
    this.selectedLesson = null;
    this.selectedQuiz = this.quiz;
  }
}
