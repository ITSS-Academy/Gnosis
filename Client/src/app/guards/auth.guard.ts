import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, catchError, map, of } from 'rxjs';
import { UserState } from '../ngrx/states/user.state';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  constructor(
    private store: Store<{ user: UserState }>,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.store.select('user', 'user').pipe(
      map((user) => {
        if (user.uid != '' && user.uid != undefined && user.uid != null) {
          return true;
        } else {
          this.router.navigateByUrl('/welcome');
          return false;
        }
      }),
      catchError(() => {
        this.router.navigateByUrl('/welcome');
        return of(false);
      })
    );
  }
}

export const AuthGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  return inject(PermissionsService).canActivate(next, state);
};
