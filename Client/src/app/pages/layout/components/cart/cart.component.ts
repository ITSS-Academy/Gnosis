import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Course } from 'src/app/models/course.model';
import { CartState } from 'src/app/ngrx/states/cart.state';
import * as CartAction from 'src/app/ngrx/actions/cart.actions';
import * as ProfileAction from 'src/app/ngrx/actions/profile.actions';
import * as CourseAction from 'src/app/ngrx/actions/course.actions';
import { TuiAlertService } from '@taiga-ui/core';
import { CourseState } from 'src/app/ngrx/states/course.state';
import { AuthState } from 'src/app/ngrx/states/auth.state';
import { ProfileState } from 'src/app/ngrx/states/profile.state';
import { Observable, Subscription } from 'rxjs';
import { Profile } from 'src/app/models/profile.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.less'],
})
export class CartComponent implements OnInit {
  cartList$ = this.store.select((state) => state.cart.cartList);
  cartList: Course[] = [];
  total$ = this.store.select((state) => state.cart.total);
  total: number = 0;
  profile: Profile = <Profile>{};
  cartCount: number = 0;

  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private router: Router,
    private store: Store<{
      cart: CartState;
      course: CourseState;
      auth: AuthState;
      profile: ProfileState;
    }>
  ) {}

  ngOnInit(): void {
    this.total$.subscribe((total) => {
      if (total != undefined) {
        this.total = Number(total.toFixed(3));
      }
    });
    this.subscriptions.push(
      this.cartList$.subscribe((cartList) => {
        if (cartList != undefined) {
          this.cartList = cartList;
          this.cartCount = cartList.length;
          console.log(this.cartList);
        }
      }),
      this.store.select('profile', 'profile').subscribe((profile) => {
        if (profile != null && profile != undefined) {
          this.profile = profile;
        }
      }),
      this.store.select('auth', 'idToken').subscribe((val) => {
        if (val != '') {
          this.idToken = val;
        }
      }),
      this.store.select('profile', 'isUpdateSuccess').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Buy Course Success !!!', { status: 'success' })
            .subscribe();
          this.clearAllCart();
          this.store.dispatch(ProfileAction.clearState());
          this.store.dispatch(
            ProfileAction.get({ idToken: this.idToken, id: this.profile.id })
          );
          this.store.dispatch(
            CourseAction.getByUser({
              idToken: this.idToken,
              userId: this.profile.id,
            })
          );
        }
      }),
      this.store.select('profile', 'isUpdating').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Buying Course... !!!', { status: 'info' })
            .subscribe();
        }
      }),
      this.store.select('profile', 'errorMessage').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Buy Course Fail: ' + val, { status: 'error' })
            .subscribe();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((val) => {
      val.unsubscribe();
    });
  }

  addCourseToCart(course: Course) {
    this.store.dispatch(CartAction.addCourseToCart({ course }));
  }
  removeCourseFromCart(course: Course) {
    this.store.dispatch(CartAction.removeCourseFromCart({ course }));
  }
  clearAllCart() {
    this.store.dispatch(CartAction.clearAllCart());
  }

  backhome() {
    this.router.navigate(['/base/home']);
  }

  search = '';

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

  idToken = '';
  courseId: any = [];
  id: string[] = [];
  subscriptions: Subscription[] = [];

  buyCourse() {
    this.courseId = this.cartList.map((course) => course._id);

    let newProfile: Profile = {
      ...this.profile,
      courses: [...this.profile.courses, ...this.courseId],
    };

    console.log(newProfile);
    this.store.dispatch(
      ProfileAction.updateProfile({
        idToken: this.idToken,
        profile: newProfile,
      })
    );
  }
}
