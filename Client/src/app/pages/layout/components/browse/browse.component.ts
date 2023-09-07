import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  map,
} from 'rxjs';
import { Course } from 'src/app/models/course.model';
import { Store } from '@ngrx/store';
import { CourseState } from 'src/app/ngrx/states/course.state';
import * as CourseAction from 'src/app/ngrx/actions/course.actions';
import * as CartAction from 'src/app/ngrx/actions/cart.actions';
import { CartState } from 'src/app/ngrx/states/cart.state';
import { TuiAlertService, TuiAppearance } from '@taiga-ui/core';
import { AuthState } from 'src/app/ngrx/states/auth.state';
import { ProfileState } from 'src/app/ngrx/states/profile.state';
import { Profile } from 'src/app/models/profile.model';
import { tuiPure } from '@taiga-ui/cdk';
import { FormControl, FormGroup } from '@angular/forms';

const Category = {
  IT: 'IT',
  HR: 'HR',
  Delivery: 'Delivery',
  Finance: 'Finance',
  Bussiness: 'Bussiness',
  Math: 'Math',
  Science: 'Science',
  Chemistry: 'Chemistry',
  Physics: 'Physics',
  Biology: 'Biology',
  Psychology: 'Psychology',
  History: 'History',
  Geography: 'Geography',
  Language: 'Language',
  Culture: 'Culture',
  Social: 'Social',
  Literature: 'Literature',
  Music: 'Music',
  Art: 'Art',
  Engineering: 'Engineering',
  Architecture: 'Architecture',
  Marketing: 'Marketing',
} as const;
@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.less'],
})
export class BrowseComponent implements OnInit, OnDestroy {
  courseList$: Observable<Course[]> = this.store.select('course', 'courseList');
  courselist: Course[] = [];
  cartList$ = this.store.select('cart', 'cartList');
  cartList: Course[] = [];
  idToken$: Observable<string> = this.store.select('auth', 'idToken');
  profile$: Observable<Profile> = this.store.select('profile', 'profile');
  subscriptions: Subscription[] = [];

  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private router: Router,
    private store: Store<{
      course: CourseState;
      cart: CartState;
      auth: AuthState;
      profile: ProfileState;
    }>
  ) {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((val) => {
      val.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.cartList$.subscribe((cartList) => {
        if (cartList != undefined && cartList != null && cartList.length > 0) {
          this.cartList = [...cartList];
          console.log('cartList: ', this.cartList);
        }
      }),
      this.courseList$.subscribe((item) => {
        // console.log('item: ', item);
        if (item != undefined && item != null && item.length > 0) {
          console.log('courseList: ', item);
        }
      }),
      combineLatest({
        idToken: this.idToken$,
        profile: this.profile$,
      }).subscribe((res) => {
        if (
          res.idToken != undefined &&
          res.idToken != null &&
          res.idToken != '' &&
          res.profile != undefined &&
          res.profile != null
        ) {
          // console.log(res);
          this.store.dispatch(
            CourseAction.getByUser({
              idToken: res.idToken,
              userId: res.profile.id,
            })
          );
        }
      }),
      this.store.select('course', 'getErrMess').subscribe((val) => {
        if (val != '') {
          this.alerts.open(val, { status: 'error' }).subscribe();
        }
      })
    );
  }

  backhome() {
    this.router.navigate(['/base/home']);
  }

  description(id: string) {
    this.router.navigate([`/base/browse/detail/${id}`]);
  }

  addCourseToCart(course: Course) {
    let isExist = false;
    this.cartList.forEach((item) => {
      console.log(item);
      if (item._id == course._id) {
        this.warningNotification(`${course.name} is already in the cart`);
        isExist = true;
        return;
      }
    });
    if (isExist) {
      return;
    }
    this.store.dispatch(CartAction.addCourseToCart({ course }));
    this.successNotification(`${course.name} has been added to the cart`);
  }

  successNotification(message: string): void {
    this.alerts
      .open('', {
        label: message,
        status: 'success',
        autoClose: 4000,
      })
      .subscribe();
  }
  warningNotification(message: string): void {
    this.alerts
      .open('', {
        label: message,
        status: 'warning',
        autoClose: 4000,
      })
      .subscribe();
  }

  search = '';

  readonly categories = Object.values(Category);

  readonly filters$ = new BehaviorSubject<readonly string[]>([
    ...this.categories,
  ]);

  @tuiPure
  get model$(): Observable<readonly string[]> {
    return this.filters$.pipe(
      map((value) => (value.length === this.categories.length ? [] : value))
    );
  }

  @tuiPure
  get buttonAppearance$(): Observable<TuiAppearance> {
    return this.filters$.pipe(
      map((value) => {
        if (value.length === this.categories.length) {
          this.filterList = [...this.categories];
          console.log(this.filterList);
        }
        return value.length === this.categories.length
          ? TuiAppearance.Primary
          : TuiAppearance.Whiteblock;
      })
    );
  }

  filterList: string[] = [];
  onModelChange(model: readonly string[]): void {
    console.log(model);
    this.filterList = [...model];
    this.filters$.next(model);
  }

  toggleAll(): void {
    this.filters$.next(
      this.categories.length === this.filters$.value.length
        ? []
        : [...this.categories]
    );
  }
}
