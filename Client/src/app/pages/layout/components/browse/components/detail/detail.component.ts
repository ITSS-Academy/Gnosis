import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Course } from 'src/app/models/course.model';
import { AuthState } from 'src/app/ngrx/states/auth.state';
import { CourseState } from 'src/app/ngrx/states/course.state';
import * as CourseAction from 'src/app/ngrx/actions/course.actions';
import * as CartAction from 'src/app/ngrx/actions/cart.actions';
import { CartState } from 'src/app/ngrx/states/cart.state';
import { TuiAlertService } from '@taiga-ui/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less'],
})
export class DetailComponent implements OnInit {
  //lưu ý thằng dưới !!!!
  courseDetail$: Observable<Course> = this.store.select(
    'course',
    'courseDetail'
  );
  idToken$: Observable<string> = this.store.select('auth', 'idToken');
  cartList$ = this.store.select('cart', 'cartList');
  cartList: Course[] = [];

  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private router: Router,
    private route: ActivatedRoute,

    private store: Store<{
      course: CourseState;
      auth: AuthState;
      cart: CartState;
    }>
  ) {}

  ngOnInit(): void {
    this.cartList$.subscribe((cartList) => {
      if (cartList != undefined) {
        this.cartList = cartList;
      }
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.idToken$.subscribe((value) => {
          if (value) {
            this.store.dispatch(
              CourseAction.getCourseDetail({ idToken: value, id })
            );
          }
        });
      }
    });
  }

  addCourseToCart(course: Course) {
    let isExist = false;
    this.cartList.forEach((item) => {
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

  backhome() {
    this.router.navigate(['/base/home']);
  }
  backcourse() {
    this.router.navigate(['/base/browse']);
  }

  rateControl = new FormControl(2);
  rateValue = 2;
  enableOrDisable(): void {
    if (this.rateControl.disabled) {
      this.rateControl.enable();
    } else {
      this.rateControl.disable();
    }
  }
  search = '';
}
