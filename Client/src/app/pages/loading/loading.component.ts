import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, combineLatest, forkJoin, take } from 'rxjs';
import { UserState } from 'src/app/ngrx/states/user.state';
import * as UserActions from 'src/app/ngrx/actions/user.actions';
import { TuiAlertService } from '@taiga-ui/core';
import { AuthState } from 'src/app/ngrx/states/auth.state';
import * as AuthActions from 'src/app/ngrx/actions/auth.actions';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.less', './loading.component.scss'],
})
export class LoadingComponent {
  idToken$ = this.store.select('auth', 'idToken');
  idToken = '';
  uid$ = this.store.select('auth', 'uid');
  uid = '';
  user$ = this.store.select('user', 'user');
  isSuccess$ = this.store.select('user', 'isSuccess');
  isGetSuccess$ = this.store.select('user', 'isGetSuccess');
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private store: Store<{ user: UserState; auth: AuthState }>,
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
      this.store.select('user', 'isLoading').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Creating user info...', { status: 'info' })
            .subscribe();
        }
      }),
      this.store.select('user', 'getErrorMessage').subscribe((val) => {
        if (val != '') {
          this.alerts.open(val, { status: 'error' }).subscribe();
        }
      }),
      this.store.select('user', 'isSuccess').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Create user info success !!!', {
              status: 'success',
            })
            .subscribe();
        }
      })
    );
    setTimeout(() => {
      this.subscriptions.push(
        combineLatest({
          idToken: this.idToken$,
          user: this.user$,
          isGetSuccess: this.isGetSuccess$,
          isSuccess: this.isSuccess$,
          uid: this.uid$,
        }).subscribe((res) => {
          if (res.isGetSuccess && res.user.uid) {
            console.log(res);
            if (res.user.profile != null) {
              this.router.navigateByUrl('/base');
            } else {
              this.router.navigateByUrl('/register');
            }
          }
          if (!res.isGetSuccess && !res.isSuccess) {
            this.store.dispatch(
              UserActions.createUser({ idToken: res.idToken })
            );
          }
          if (res.uid && res.idToken && res.isSuccess) {
            if (res.uid != this.uid && res.idToken != this.idToken) {
              this.idToken = res.idToken;
              this.uid = res.uid;
              // console.log('alo');
              this.store.dispatch(
                UserActions.getUser({ uid: res.uid, idToken: res.idToken })
              );
            }
          }
        })
      );
    }, 5000);
  }
}
