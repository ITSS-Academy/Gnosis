import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  OnInit,
  Inject,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Course } from 'src/app/models/course.model';
import { Profile } from 'src/app/models/profile.model';
import * as AuthActions from '../../../../ngrx/actions/auth.actions';
import { AuthState } from 'src/app/ngrx/states/auth.state';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { ProfileState } from 'src/app/ngrx/states/profile.state';
import { UserState } from 'src/app/ngrx/states/user.state';
import { Router } from '@angular/router';
import * as ProfileAction from 'src/app/ngrx/actions/profile.actions';
import { UserInfo } from 'src/app/models/user.model';
import { TuiAlertService } from '@taiga-ui/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit, OnDestroy {
  @Input('isEdit') isEdit: boolean = false;
  @Input('course') course: Course | null = null;
  @Input('profile') profile: Profile | null = null;

  readonly genders = ['Male', 'Female'];
  readonly countries = [
    'VietNam',
    'Japan',
    'Korea',
    'China',
    'USA',
    'UK',
    'Germany',
    'Italian',
    'France',
    'Spain',
    'Portugal',
    'Brazil',
    'Holland',
  ];
  subscriptions: Subscription[] = [];
  courses: Course[] = [];
  ongoingCourses: Course[] = [];
  completedCourses: Course[] = [];
  idToken$: Observable<string> = this.store.select('auth', 'idToken');
  profile$ = this.store.select('profile', 'profile');
  user$: Observable<UserInfo> = this.store.select('user', 'user');
  idToken = '';
  id: string[] = [];
  oldProfile: Profile = <Profile>{};

  profileForm = new FormGroup({
    id: new FormControl({ value: '', disabled: true }, Validators.required),
    userName: new FormControl(
      { value: '', disabled: false },
      Validators.required
    ),
    displayName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    avatar: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    bio: new FormControl('', Validators.required),
    notifications: new FormArray([], Validators.required),
  });

  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private router: Router,
    private store: Store<{
      profile: ProfileState;
      auth: AuthState;
      user: UserState;
    }>
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((val) => {
      val.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.store.select('profile', 'profile').subscribe((val) => {
        if (val != null && val != undefined) {
          this.profileForm.controls.id.setValue(val.id);
          this.profileForm.controls.userName.setValue(val.userName);
          this.profileForm.controls.displayName.setValue(val.displayName);
          this.profileForm.controls.email.setValue(val.email);
          this.profileForm.controls.country.setValue(val.country);
          this.profileForm.controls.avatar.setValue(val.avatar);
          this.profileForm.controls.gender.setValue(val.gender);
          this.profileForm.controls.bio.setValue(val.bio);
        }
      }),
      this.profile$.subscribe((profile) => {
        if (profile != null && profile != undefined) {
          this.courses = profile.courses || [];
          this.ongoingCourses = profile.ongoingCourse || [];
          this.completedCourses = profile.completedCourse || [];
        }
      }),
      this.store.select('auth', 'idToken').subscribe((val) => {
        if (val != '') {
          this.idToken = val;
        }
      }),
      this.store.select('profile', 'profile').subscribe((profile) => {
        if (profile != null && profile != undefined) {
          this.oldProfile = profile;
        }
      }),
      this.store.select('profile', 'isUpdating').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Update Course... !!!', { status: 'info' })
            .subscribe();
        }
      }),
      this.store.select('profile', 'isUpdateSuccess').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Update Course Success !!!', { status: 'success' })
            .subscribe();
          this.store.dispatch(ProfileAction.clearState());
          this.store.dispatch(
            ProfileAction.get({ id: this.oldProfile.id, idToken: this.idToken })
          );
        }
      }),

      combineLatest({
        idToken: this.idToken$,
        user: this.user$,
        profile: this.profile$,
      }).subscribe((res) => {
        if (
          res.user != undefined &&
          res.idToken != undefined &&
          res.user != null &&
          res.idToken != null &&
          res.idToken != '' &&
          (res.profile == null || res.profile == undefined)
        ) {
          this.store.dispatch(
            ProfileAction.get({ id: res.user.uid, idToken: res.idToken })
          );
        }
      })
    );
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  updateProfile() {
    let profileData = {
      id: this.profileForm.controls['id'].value ?? '',
      email: this.profileForm.controls['email'].value ?? '',
      userName: this.profileForm.value.userName ?? 'abc',
      displayName: this.profileForm.value.displayName ?? '',
      country: this.profileForm.value.country ?? '',
      avatar: this.profileForm.value.avatar ?? '',
      gender: this.profileForm.value.gender ?? '',
      bio: this.profileForm.value.bio ?? '',
      notifications: [],
      ...this.profile,
    };

    this.store.dispatch(
      ProfileAction.updateProfile({
        idToken: this.idToken,
        profile: profileData as Profile,
      })
    );
  }

  toCourse(course: Course) {
    this.router.navigate(['base/course', course._id]);
  }
}
