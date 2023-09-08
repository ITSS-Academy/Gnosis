import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest, interval } from 'rxjs';
import { AuthState } from 'src/app/ngrx/states/auth.state';
import { ProfileState } from 'src/app/ngrx/states/profile.state';
import { Router } from '@angular/router';
import * as ProfileAction from 'src/app/ngrx/actions/profile.actions';
import { UserState } from 'src/app/ngrx/states/user.state';
import { Course } from 'src/app/models/course.model';
import { Profile } from 'src/app/models/profile.model';
import { UserInfo } from 'src/app/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnDestroy, OnInit {
  private timerSubscription: Subscription | undefined;
  currentTime: string = '';

  getOrdinal(n: number) {
    if (n === 1 || n === 21 || n === 31) {
      return n + 'st';
    } else if (n === 2 || n === 22) {
      return n + 'nd';
    } else if (n === 3 || n === 23) {
      return n + 'rd';
    } else {
      return n + 'th';
    }
  }

  getDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.toLocaleString('default', { month: 'short' });
    const day = this.getOrdinal(now.getDate());
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfWeek = daysOfWeek[now.getDay()];
    return `${dayOfWeek},${day} ${month} ${year} --- ${hour}:${minute}:${second}`;
  }

  updateCurrentTime() {
    this.currentTime = this.getDateTime();
    this.cdr.detectChanges();
  }

  search = '';
  open = false;

  readonly courseFilterForm = new FormGroup({
    filter: new FormControl('Courses'),
  });
  readonly courses_state = ['Courses', 'Ongoing Courses', 'Completed Courses'];

  idToken$: Observable<string> = this.store.select('auth', 'idToken');
  profile$ = this.store.select('profile', 'profile');
  user$: Observable<UserInfo> = this.store.select('user', 'user');

  state: string = 'Courses';
  onRadioChange(selectedState: string) {
    this.state = selectedState;
  }

  subscriptions: Subscription[] = [];
  courses: Course[] = [];
  ongoingCourse: Course[] = [];
  completedCourse: Course[] = [];
  profile: Profile = <Profile>{};

  homeForm = new FormGroup({
    id: new FormControl('', Validators.required),
    avatar: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    displayName: new FormControl('', Validators.required),
    userName: new FormControl('', Validators.required),
    courses: new FormArray([], Validators.required),
    ongoingCourse: new FormArray([], Validators.required),
    completedCourse: new FormArray([], Validators.required),
  });

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private store: Store<{
      profile: ProfileState;
      auth: AuthState;
      user: UserState;
    }>
  ) {}

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.subscriptions.forEach((val) => {
      val.unsubscribe();
    });
    this.homeForm.reset();
  }

  ngOnInit(): void {
    this.updateCurrentTime();
    this.timerSubscription = interval(1000).subscribe(() => {
      this.updateCurrentTime();
    });
    this.subscriptions.push(
      this.store.select('profile', 'profile').subscribe((val) => {
        if (val != null && val != undefined && val.id != '') {
          this.profile = val;

          this.homeForm.controls.avatar.setValue(val.avatar);
          this.homeForm.controls.id.setValue(val.id);
          this.homeForm.controls.email.setValue(val.email);
          this.homeForm.controls.displayName.setValue(val.displayName);
          this.homeForm.controls.userName.setValue(val.userName);

          this.courses = val.courses || [];
          this.ongoingCourse = val.ongoingCourse || [];
          this.completedCourse = val.completedCourse || [];
        }
      }),
      combineLatest({
        idToken: this.idToken$,
        user: this.user$,
      }).subscribe((res) => {
        if (
          res.user != undefined &&
          res.user != null &&
          res.user.uid != '' &&
          res.idToken != undefined &&
          res.idToken != null &&
          res.idToken != ''
        ) {
          this.idToken = res.idToken;
          this.store.dispatch(
            ProfileAction.get({ id: res.user.uid, idToken: res.idToken })
          );
        }
      })
    );
  }

  toEdit() {
    this.router.navigate(['/base/profile']);
  }

  toBuy() {
    this.router.navigate(['base/browse']);
  }
  ongoingCourseId: any = '';
  idToken = '';

  toCourse(course: Course) {
    this.router.navigate(['base/home/course', course._id]);
    this.ongoingCourseId = course._id;

    let newProfile: any = {
      ...this.profile,
    };

    if (
      this.ongoingCourse.some((course) => course._id == this.ongoingCourseId) ||
      this.completedCourse.some((course) => course._id == this.ongoingCourseId)
    ) {
      this.store.dispatch(
        ProfileAction.get({ id: this.profile.id, idToken: this.idToken })
      );
    } else {
      newProfile.courses = this.profile.courses.filter(
        (courseId) => courseId._id != this.ongoingCourseId
      );
      newProfile.ongoingCourse = [
        ...newProfile.ongoingCourse,
        this.ongoingCourseId,
      ];

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
}
