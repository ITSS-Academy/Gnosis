import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ProfileService } from 'src/app/services/profile/profile.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { CourseService } from 'src/app/services/course/course.service';

import * as ProfileActions from 'src/app/ngrx/actions/profile.actions';
import * as CartActions from 'src/app/ngrx/actions/cart.actions';

@Injectable()
export class ProfileEffects {
  constructor(
    private action$: Actions,
    private profileService: ProfileService,
    private courseService: CourseService
  ) {}

  create$ = createEffect(() =>
    this.action$.pipe(
      ofType(ProfileActions.create),
      switchMap((action) => {
        return this.profileService.create(action.profile, action.idToken);
      }),
      map((res) => {
        if (res.message) {
          return ProfileActions.createFailure({ errorMessage: res.message });
        }
        return ProfileActions.createSuccess();
      }),
      catchError((error) => {
        return of(
          ProfileActions.createFailure({ errorMessage: error.error.message })
        );
      })
    )
  );

  get$ = createEffect(() =>
    this.action$.pipe(
      ofType(ProfileActions.get),
      switchMap((action) => {
        return this.profileService.getById(action.id, action.idToken);
      }),
      map((profile) => {
        return ProfileActions.getSuccess({ profile });
      }),
      catchError((error) => {
        return of(
          ProfileActions.getFailure({ errorMessage: error.error.message })
        );
      })
    )
  );

  updateProfile$ = createEffect(() =>
    this.action$.pipe(
      ofType(ProfileActions.updateProfile),
      switchMap((action) => {
        return this.profileService.updateProfile(
          action.idToken,
          action.profile
        );
      }),
      map((profile) => {
        if (profile == null) {
          return ProfileActions.updateProfileFailure({
            errorMessage: 'Update profile failed',
          });
        } else {
          return ProfileActions.updateProfileSuccess({ profile });
        }
      }),
      catchError((error) => {
        return of(
          ProfileActions.updateProfileFailure({
            errorMessage: error.error.message,
          })
        );
      })
    )
  );

  buyCourse$ = createEffect(() =>
    this.action$.pipe(
      ofType(CartActions.buyCourse),
      switchMap((action) => {
        return this.courseService.buyCoure(
          action.idToken,
          action.courseId,
          action.userId
        );
      }),
      map((profile) => {
        return CartActions.buyCourseSuccess({ profile });
      }),
      catchError((error) => {
        return of(CartActions.buyCourseFailure({ buyErrorMessage: error }));
      })
    )
  );
}
