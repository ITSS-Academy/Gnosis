import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProfileState } from './ngrx/states/profile.state';
import { UserState } from './ngrx/states/user.state';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as AuthActions from './ngrx/actions/auth.actions';
import * as UserActions from './ngrx/actions/user.actions';
import { AuthState } from './ngrx/states/auth.state';
import { combineLatest } from 'rxjs';
import { TuiAlertService } from '@taiga-ui/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  title = 'Gnosis';
  idToken$ = this.store.select('auth', 'idToken');
  uid$ = this.store.select('auth', 'uid');

  constructor(
    private auth: Auth,
    private router: Router,
    private store: Store<{
      profile: ProfileState;
      user: UserState;
      auth: AuthState;
    }>
  ) {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        let idToken = await user!.getIdToken(true);
        this.store.dispatch(AuthActions.storedIdToken({ idToken }));
        this.store.dispatch(AuthActions.storedUserUid({ uid: user.uid }));
        this.router.navigateByUrl('/loading');
      } else {
      }
    });

    combineLatest([this.idToken$, this.uid$]).subscribe((res) => {
      if (res[0] != '' && res[1] != '') {
        this.store.dispatch(
          UserActions.getUser({ uid: res[1], idToken: res[0] })
        );
      }
    });

    this.store.select('auth', 'isLogoutSuccess').subscribe((val) => {
      if (val) {
        this.router.navigateByUrl('/login');
      }
    });
  }
  ngOnInit(): void {}
}
