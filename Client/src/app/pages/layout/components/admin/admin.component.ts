import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiPreviewDialogService } from '@taiga-ui/addon-preview';
import { tuiIsPresent } from '@taiga-ui/cdk';
import {
  TuiAlertService,
  TuiDialogContext,
  TuiDialogService,
} from '@taiga-ui/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  filter,
  map,
  of,
  startWith,
  switchMap,
  timer,
} from 'rxjs';
import { Course } from 'src/app/models/course.model';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { Store } from '@ngrx/store';
import { CourseState } from 'src/app/ngrx/states/course.state';
import { AuthState } from 'src/app/ngrx/states/auth.state';
import * as CourseActions from '../../../../ngrx/actions/course.actions';
import { QuizState } from 'src/app/ngrx/states/quiz.state';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less'],
})
export class AdminComponent implements OnInit, OnDestroy {
  @ViewChild('preview')
  readonly preview?: TemplateRef<TuiDialogContext>;

  readonly searchForm = new FormGroup({
    searchValue: new FormControl(''),
  });

  checkboxList = new FormControl('Check');
  courseList: Course[] = [];
  isLoading = false;
  idToken = '';
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    @Inject(TuiPreviewDialogService)
    private readonly previewDialogService: TuiPreviewDialogService,
    @Inject(TuiAlertService)
    private readonly alerts: TuiAlertService,
    @Inject(TuiDialogService)
    private readonly dialogs: TuiDialogService,
    private store: Store<{
      course: CourseState;
      auth: AuthState;
      quiz: QuizState;
    }>
  ) {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((val) => {
      val.unsubscribe();
    });
    this.store.dispatch(CourseActions.clearState());
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.store.select('auth', 'idToken').subscribe((idToken) => {
        if (idToken != '' && idToken != undefined && idToken != null) {
          this.idToken = idToken;
          this.store.dispatch(CourseActions.get({ idToken }));
        } else {
          this.alerts
            .open('idToken is empty !!!', { status: 'error' })
            .subscribe();
        }
      }),
      this.store.select('course', 'courseList').subscribe((courseList) => {
        if (
          courseList != undefined &&
          courseList != null &&
          courseList.length > 0
        ) {
          console.log('courseList: ', courseList);
          this.courseList = courseList;
          if (this.selectedCourse != null) {
            this.courseList.forEach((val, i) => {
              if (val._id == this.selectedCourse?._id) {
                this.selectedCourse = val;
                console.log('selectedCourse: ', this.selectedCourse);
              }
            });
          }
        }
      }),
      this.store.select('course', 'isLoading').subscribe((val) => {
        this.isLoading = val;
        // console.log(this.isLoading);
      }),
      this.store.select('course', 'error').subscribe((val) => {
        if (val != '' && val != undefined && val != null) {
          this.alerts.open(val, { status: 'error' }).subscribe();
        }
      }),
      this.store.select('course', 'isAddLoading').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Creating Course...', { status: 'info' })
            .subscribe();
        }
      }),
      this.store.select('course', 'isAddSuccess').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Create Course Success !!!', { status: 'success' })
            .subscribe();
          this.store.dispatch(CourseActions.get({ idToken: this.idToken }));
        }
      }),
      this.store.select('course', 'addErrMess').subscribe((val) => {
        if (val != '' && val != undefined && val != null) {
          this.alerts.open(val, { status: 'error' }).subscribe();
        }
      }),
      this.store.select('course', 'isUpLoading').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Updating Course...', { status: 'info' })
            .subscribe();
        }
      }),
      this.store.select('course', 'isUpSuccess').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Updated Course Success !!!', { status: 'success' })
            .subscribe();
          this.store.dispatch(CourseActions.get({ idToken: this.idToken }));
        }
      }),
      this.store.select('course', 'updateErrMess').subscribe((val) => {
        if (val != '' && val != undefined && val != null) {
          this.alerts.open(val, { status: 'error' }).subscribe();
        }
      }),
      this.store.select('course', 'isDelLoading').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Deleting Course...', { status: 'info' })
            .subscribe();
        }
      }),
      this.store.select('course', 'isDelSuccess').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Deleted Course Success !!!', { status: 'success' })
            .subscribe();
          this.checkboxList.setValue('Check');
          this.selectedCourse = null;
          this.store.dispatch(CourseActions.get({ idToken: this.idToken }));
        }
      }),
      this.store.select('course', 'delErrMess').subscribe((val) => {
        if (val != '' && val != undefined && val != null) {
          this.alerts.open(val, { status: 'error' }).subscribe();
        }
      }),
      this.store.select('quiz', 'isCreateLoading').subscribe((val) => {
        if (val) {
          this.alerts
            .open(`Creating Course's Quiz ...`, { status: 'info' })
            .subscribe();
        }
      }),
      this.store.select('quiz', 'isCreateSuccess').subscribe((val) => {
        if (val) {
          this.alerts

            .open(`Create Course's Quiz Success !!!`, { status: 'success' })
            .subscribe();
        }
      }),
      this.store.select('quiz', 'createMessError').subscribe((val) => {
        if (val != '' && val != undefined && val != null) {
          this.alerts.open(val, { status: 'error' }).subscribe();
        }
      })
    );
  }

  selectedCourse: Course | null = null;
  selectEditCourse(course: Course) {
    if (this.selectedCourse?._id !== course._id) {
      this.selectedCourse = <Course>{ ...course };
      console.log('select courrse', this.selectedCourse._id);
    }
  }

  openEdit = false;
  openEditSidebar(open: boolean): void {
    console.log('openEditSidebar: ', open);
    if (open != this.openEdit) {
      this.openEdit = open;
    }
  }
  openCreate = false;
  openCreateSidebar(open: boolean): void {
    if (open != this.openCreate) {
      this.openCreate = open;
    }
  }

  editLessons($event: boolean) {
    this.openEditSidebar($event);
    if (this.selectedCourse != null) {
      this.router.navigateByUrl(
        `/base/admin/course/${this.selectedCourse._id}`
      );
    }
  }

  editQuiz($event: boolean) {
    this.openEditSidebar($event);
    if (this.selectedCourse != null) {
      this.router.navigateByUrl(
        `/base/admin/course/${this.selectedCourse._id}/quiz`
      );
    }
  }

  //image preview
  images = [
    {
      title: 'some table.xlsx',
      hasPreview: false,
      src: '',
    },
  ];

  readonly index$$ = new BehaviorSubject<number>(0);

  readonly item$ = this.index$$.pipe(
    map((index) => this.images[index]),
    filter(tuiIsPresent)
  );

  readonly title$ = this.item$.pipe(map((item) => item.title));

  readonly contentUnavailable$ = this.item$.pipe(
    map((item) => !item.hasPreview)
  );

  readonly imageSrc$ = this.item$.pipe(
    switchMap((item) =>
      item.hasPreview
        ? this.emulateBackendRequest(item.src).pipe(startWith(''))
        : of(null)
    )
  );

  readonly loading$ = this.imageSrc$.pipe(map((src) => src === ''));

  show(index: number): void {
    this.images = [];
    this.images.push({
      hasPreview: true,
      src: this.courseList[index].img,
      title: this.courseList[index].name,
    });
    this.previewDialogService.open(this.preview || '').subscribe();
  }

  download(): void {
    this.alerts.open('Downloading...').subscribe();
  }

  emulateBackendRequest(src: string): Observable<string> {
    return timer(1500).pipe(map(() => src));
  }

  //create func
  createCourse(course: Course) {
    this.openCreate = false;
    this.store.dispatch(
      CourseActions.create({ idToken: this.idToken, course })
    );
  }

  //delete func
  showWarningDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogs.open(content).subscribe();
  }

  deleteCourse() {
    if (this.selectedCourse == null) {
      this.alerts
        .open('Please select course !!!', { status: 'error' })
        .subscribe();
      return;
    }
    this.store.dispatch(
      CourseActions.remove({
        idToken: this.idToken,
        id: this.selectedCourse._id,
      })
    );
  }

  //update func
  updateCourse($event: Course) {
    // console.log($event);
    this.openEdit = false;
    this.store.dispatch(
      CourseActions.update({ idToken: this.idToken, course: $event })
    );
  }
}
