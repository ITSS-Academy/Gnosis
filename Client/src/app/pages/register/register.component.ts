import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserState } from 'src/app/ngrx/states/user.state';
import { ProfileState } from 'src/app/ngrx/states/profile.state';
import { Profile } from 'src/app/models/profile.model';
import { Subscription } from 'rxjs';
import * as ProfileAction from 'src/app/ngrx/actions/profile.actions';
import { AuthState } from 'src/app/ngrx/states/auth.state';
import { TuiAlertService } from '@taiga-ui/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})
export class RegisterComponent implements OnInit, OnDestroy {
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

  idToken = '';
  subscriptions: Subscription[] = [];

  regisForm = new FormGroup({
    uid: new FormControl('', Validators.required),
    avatar: new FormControl('', Validators.required),
    email: new FormControl({ value: '', disabled: true }, Validators.required),
    userName: new FormControl('', [
      Validators.required,
      Validators.pattern(/[a-zA-Z-0-9]+/g),
    ]),
    displayName: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
  });

  constructor(
    private router: Router,
    private store: Store<{
      profile: ProfileState;
      user: UserState;
      auth: AuthState;
    }>,
    @Inject(TuiAlertService)
    private readonly alerts: TuiAlertService
  ) {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((val) => {
      val.unsubscribe();
    });
  }
  ngOnInit(): void {
    this.subscriptions.push(
      this.store.select('user', 'user').subscribe((val) => {
        if (val.uid) {
          this.regisForm.controls.avatar.setValue(val.picture);
          this.regisForm.controls.uid.setValue(val.uid);
          this.regisForm.controls.email.setValue(val.email);
          this.regisForm.controls.displayName.setValue(val.name);
        }
      }),
      this.store.select('auth', 'idToken').subscribe((val) => {
        if (val != '') {
          this.idToken = val;
        }
      }),
      this.store.select('profile', 'isSuccess').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Create Profile Success !!!', { status: 'success' })
            .subscribe();
          this.router.navigateByUrl('/base');
        }
      }),
      this.store.select('profile', 'isLoading').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Creating Profile... !!!', { status: 'info' })
            .subscribe();
        }
      }),
      this.store.select('profile', 'errorMessage').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Create Profile Fail: ' + val, { status: 'error' })
            .subscribe();
        }
      })
    );
  }

  register() {
    let regisData: Profile = {
      id: this.regisForm.value.uid ?? '',
      email: this.regisForm.controls['email'].value ?? '',
      userName: this.regisForm.value.userName ?? 'abc',
      displayName: this.regisForm.value.displayName ?? '',
      country: this.regisForm.value.country ?? '',
      avatar: this.regisForm.value.avatar ?? '',
      gender: this.regisForm.value.gender ?? '',
      courses: [],
      bio: '',
      notifications: [],
      ongoingCourse: [],
      completedCourse: [],
      role: 'user',
    };

    this.store.dispatch(
      ProfileAction.create({
        profile: regisData,
        idToken: this.idToken,
      })
    );
  }
}
