import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { CourseService } from 'src/app/services/course/course.service';
import * as CourseAction from '../actions/course.actions';

@Injectable()
export class CourseEffects {
  constructor(private courseService: CourseService, private action$: Actions) {}
  get$ = createEffect(() =>
    this.action$.pipe(
      ofType(CourseAction.get),
      exhaustMap((action) =>
        this.courseService.getCourse(action.idToken).pipe(
          map((items) => {
            console.log(items);
            if (items != undefined || items != null) {
              if (items.message) {
                return CourseAction.getFailure({ error: items.message });
              }
              return CourseAction.getSuccess({ courseList: items });
            } else {
              return CourseAction.getFailure({
                error: 'Course is undefined or null',
              });
            }
          }),
          catchError((error) => of(CourseAction.getFailure({ error })))
        )
      )
    )
  );

  getCourseDetail$ = createEffect(() =>
    this.action$.pipe(
      ofType(CourseAction.getCourseDetail),
      exhaustMap((action) =>
        this.courseService.getCourseById(action.idToken, action.id).pipe(
          map((items) => {
            if (items != undefined && items != null) {
              if ((items as any).message) {
                return CourseAction.getCourseDetailFailure({
                  error: (items as any).message,
                });
              }
              return CourseAction.getCourseDetailSuccess({
                courseDetail: items,
              });
            } else {
              return CourseAction.getCourseDetailFailure({
                error: 'Course is undefined or null',
              });
            }
          }),
          catchError((error) => {
            return of(CourseAction.getCourseDetailFailure({ error }));
          })
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.action$.pipe(
      ofType(CourseAction.create),
      exhaustMap((action) =>
        this.courseService.create(action.idToken, action.course).pipe(
          map((item) => {
            if (item != undefined && item != null) {
              console.log(item);
              return CourseAction.createSuccess({ newCourse: item });
            } else {
              return CourseAction.createFailure({ error: 'create failure' });
            }
          }),
          catchError((error) => of(CourseAction.createFailure({ error })))
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.action$.pipe(
      ofType(CourseAction.update),
      exhaustMap((action) =>
        this.courseService.update(action.idToken, action.course).pipe(
          map((item) => {
            if (item != undefined && item != null) {
              return CourseAction.updateSuccess({ updatedCourse: item });
            } else {
              return CourseAction.updateFailure({ error: 'update failure' });
            }
          }),
          catchError((error) => of(CourseAction.updateFailure({ error })))
        )
      )
    )
  );

  remove$ = createEffect(() =>
    this.action$.pipe(
      ofType(CourseAction.remove),
      exhaustMap((action) =>
        this.courseService.remove(action.idToken, action.id).pipe(
          map((item) => {
            if (item != undefined && item != null) {
              return CourseAction.removeSuccess({ course: item });
            } else {
              return CourseAction.removeFailure({ error: 'remove failure' });
            }
          }),
          catchError((error) => of(CourseAction.updateFailure({ error })))
        )
      )
    )
  );

  getCourseByUser$ = createEffect(() =>
    this.action$.pipe(
      ofType(CourseAction.getByUser),
      exhaustMap((action) =>
        this.courseService
          .getCourseByUserId(action.idToken, action.userId)
          .pipe(
            map((items) => {
              if (items != undefined || items != null) {
                if ((items as any).message) {
                  return CourseAction.getByUserFailure({
                    getErrMess: (items as any).message,
                  });
                }
                return CourseAction.getByUserSuccess({
                  courseList: items,
                });
              } else {
                return CourseAction.getByUserFailure({
                  getErrMess: 'Course is undefined or null',
                });
              }
            }),
            catchError((error) =>
              of(CourseAction.getByUserFailure({ getErrMess: error }))
            )
          )
      )
    )
  );
}
