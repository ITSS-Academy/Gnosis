import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Lesson } from 'src/app/models/lesson.model';
import {
  TuiAlertService,
  TuiDialogContext,
  TuiDialogService,
} from '@taiga-ui/core';
import { Router } from '@angular/router';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { Course } from 'src/app/models/course.model';
import {
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  pipe,
  switchMap,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/ngrx/states/auth.state';
import { CourseState } from 'src/app/ngrx/states/course.state';
import { LessonState } from 'src/app/ngrx/states/lesson.state';
import * as LessonActions from 'src/app/ngrx/actions/lesson.actions';
import * as CourseActions from 'src/app/ngrx/actions/course.actions';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.less'],
})
export class LessonComponent implements OnInit, OnDestroy {
  isPreview: boolean = true;
  isSave: boolean = false;
  isGettingCourse: boolean = false;
  isGettingLessons: boolean = false;

  subscriptions: Subscription[] = [];
  items = [
    {
      caption: 'Admin',
      routerLink: '/base/admin',
    },
  ];

  course: Course = <Course>{};
  idToken = '';

  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private router: Router,
    @Inject(TuiDialogService)
    private readonly dialogs: TuiDialogService,
    private store: Store<{
      auth: AuthState;
      course: CourseState;
      lesson: LessonState;
    }>
  ) {
    this.items.push({
      caption: 'Current',
      routerLink: this.router.url,
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((val) => {
      val.unsubscribe();
    });
    this.store.dispatch(LessonActions.clearState());
  }
  ngOnInit(): void {
    this.subscriptions.push(
      this.newList$
        .pipe(debounceTime(500), distinctUntilChanged())
        .subscribe((newList) => {
          console.log('update ordinal num: ', newList);
          // newList.forEach((val, i) => {
          //   this.store.dispatch(
          //     LessonActions.update({ idToken: this.idToken, lesson: val })
          //   );
          // });
        }),
      this.store.select('auth', 'idToken').subscribe((idToken) => {
        if (idToken != '' && idToken != null && idToken != undefined) {
          this.idToken = idToken;
          console.log(`lesson's course id: `, this.router.url.split('/')[4]);
          this.store.dispatch(
            LessonActions.getAllByCourseId({
              idToken,
              courseId: this.router.url.split('/')[4],
            })
          );
          this.store.dispatch(
            CourseActions.getCourseDetail({
              idToken,
              id: this.router.url.split('/')[4],
            })
          );
        }
      }),
      this.store.select('course', 'courseDetail').subscribe((course) => {
        if (course != null && course != undefined) {
          this.course = course;
        }
      }),
      this.store.select('course', 'isLoading').subscribe((val) => {
        this.isGettingCourse = val;
      }),
      this.store.select('course', 'isSuccess').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Get course detail success !!!', { status: 'success' })
            .subscribe();
        }
      }),
      this.store.select('course', 'error').subscribe((err) => {
        if (err != null && err != undefined && err != '') {
          this.alerts.open(err, { status: 'error' }).subscribe();
        }
      }),
      this.store.select('lesson', 'lessons').subscribe((lessons) => {
        if (lessons != null && lessons != undefined && lessons.length > 0) {
          this.lessonList = [...lessons];
          console.log(this.lessonList);
          this.lessonList.sort((a, b) => {
            return a.ordinalNum - b.ordinalNum;
          });
        }
      }),
      this.store.select('lesson', 'isGetting').subscribe((val) => {
        this.isGettingLessons = val;
      }),
      this.store.select('lesson', 'getMessError').subscribe((err) => {
        if (err != null && err != undefined && err != '') {
          this.alerts.open(err, { status: 'error' }).subscribe();
        }
      }),
      this.store.select('lesson', 'isCreateSuccess').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Create lesson success !!!', { status: 'success' })
            .subscribe();
          this.store.dispatch(
            LessonActions.getAllByCourseId({
              idToken: this.idToken,
              courseId: this.router.url.split('/')[4],
            })
          );
        }
      }),
      this.store.select('lesson', 'createMessError').subscribe((err) => {
        if (err != null && err != undefined && err != '') {
          this.alerts.open(err, { status: 'error' }).subscribe();
        }
      }),
      this.store.select('lesson', 'isUpdateSuccess').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Update lesson success !!!', { status: 'success' })
            .subscribe();
          this.store.dispatch(
            LessonActions.getAllByCourseId({
              idToken: this.idToken,
              courseId: this.router.url.split('/')[4],
            })
          );
        }
      }),
      this.store.select('lesson', 'updateMessError').subscribe((err) => {
        if (err != null && err != undefined && err != '') {
          this.alerts.open(err, { status: 'error' }).subscribe();
        }
      }),
      this.store.select('lesson', 'isDeleteSuccess').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Delete lesson success !!!', { status: 'success' })
            .subscribe();
          this.store.dispatch(
            LessonActions.getAllByCourseId({
              idToken: this.idToken,
              courseId: this.router.url.split('/')[4],
            })
          );
        }
      }),
      this.store.select('lesson', 'deleteMessError').subscribe((err) => {
        if (err != null && err != undefined && err != '') {
          this.alerts.open(err, { status: 'error' }).subscribe();
        }
      })
    );
  }

  // get func
  selectedLesson: Lesson | null = null;
  selectLesson(lesson: Lesson) {
    if (this.selectedLesson?._id === lesson._id) {
      this.alerts
        .open('Lesson already selected !!!', { status: 'warning' })
        .subscribe();
      return;
    }
    this.selectedLesson = lesson;
    this.isPreview = true;
    // console.log('selectedLesson: ', this.selectedLesson);
  }
  generateDummyContent(lessonTitle: string) {
    let dummyContent = `<p>${lessonTitle} content </p>`;
    return JSON.stringify(dummyContent);
  }

  //add func
  lessonList: Lesson[] = [];
  addLesson() {
    let newLesson = {
      title: 'Lesson ' + Date.now().toString(),
      content: this.generateDummyContent('Lesson ' + Date.now().toString()),
      courseId: this.router.url.split('/')[4],
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      ordinalNum: this.lessonList.length + 1,
    };
    this.store.dispatch(
      LessonActions.create({
        idToken: this.idToken,
        lesson: newLesson as Lesson,
      })
    );
  }

  //update func
  openEdit = false;
  openEditSidebar(open: boolean): void {
    if (open != this.openEdit) {
      this.openEdit = open;
    }
  }

  updateLessonInfo($event: Lesson) {
    this.store.dispatch(
      LessonActions.update({ idToken: this.idToken, lesson: $event })
    );
  }

  saveLessonContent() {
    this.isSave = true;
    setInterval(() => {
      this.isSave = false;
    }, 2000);
  }

  updateLessonContent(content: string) {
    let newLesson: any = {
      ...this.selectedLesson,
      content: content,
    };
    if (this.selectLesson == null) return;
    this.store.dispatch(
      LessonActions.update({
        idToken: this.idToken,
        lesson: newLesson as Lesson,
      })
    );
  }

  //delete func
  showWarningDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogs.open(content).subscribe();
  }

  deleteLesson(index: number) {
    this.lessonList = this.lessonList.filter((val, i) => {
      if (this.selectedLesson != null) {
        if (val._id == this.selectedLesson._id) {
          this.selectedLesson = null;
        }
      }
      return val;
    });
    this.store.dispatch(
      LessonActions.deleteLesson({
        idToken: this.idToken,
        lessonId: this.lessonList[index]._id,
      })
    );
  }

  //update lesson ordinal num
  newList$ = new Subject<Lesson[]>();
  order = new Map();
  updateOrdinalList() {
    let newList = [...this.lessonList];
    console.log('order change: ', this.order);
    this.order.forEach((val, i) => {
      newList[i] = {
        ...newList[i],
        ordinalNum: val,
      };
    });
    console.log(newList);
    this.newList$.next(newList);
  }
}
