import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import * as LessonActions from '../actions/lesson.actions';
import { LessonService } from 'src/app/services/lesson/lesson.service';

@Injectable()
export class LessonEffects {
  constructor(private lessonService: LessonService, private action$: Actions) {}
  getById$ = createEffect(() =>
    this.action$.pipe(
      ofType(LessonActions.getAllByCourseId),
      exhaustMap((action) =>
        this.lessonService
          .getAllByCourseId(action.idToken, action.courseId)
          .pipe(
            map((lessons) => {
              if (
                lessons != undefined &&
                lessons != null &&
                lessons.length > 0
              ) {
                return LessonActions.getAllByCourseIdSuccess({ lessons });
              } else {
                return LessonActions.getAllByCourseIdFailure({
                  error: 'Lesson is undefined or null or empty',
                });
              }
            }),
            catchError((error) => {
              return of(
                LessonActions.getAllByCourseIdFailure({
                  error: error.err.message,
                })
              );
            })
          )
      )
    )
  );

  create$ = createEffect(() =>
    this.action$.pipe(
      ofType(LessonActions.create),
      exhaustMap((action) =>
        this.lessonService.create(action.idToken, action.lesson).pipe(
          map((lesson) => {
            if (lesson != undefined && lesson != null) {
              if (lesson.message) {
                return LessonActions.createFailure({ error: lesson.message });
              }
              return LessonActions.createSuccess({ newLesson: lesson });
            } else {
              return LessonActions.createFailure({ error: 'create failure' });
            }
          }),
          catchError((error) => of(LessonActions.createFailure({ error })))
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.action$.pipe(
      ofType(LessonActions.update),
      exhaustMap((action) =>
        this.lessonService.update(action.idToken, action.lesson).pipe(
          map((lesson) => {
            if (lesson != undefined && lesson != null) {
              if (lesson.message) {
                return LessonActions.updateFailure({
                  error: lesson.error.message,
                });
              }
              return LessonActions.updateSuccess({ updatedLesson: lesson });
            } else {
              return LessonActions.updateFailure({ error: 'update failure' });
            }
          }),
          catchError((error) => of(LessonActions.updateFailure({ error })))
        )
      )
    )
  );

  remove$ = createEffect(() =>
    this.action$.pipe(
      ofType(LessonActions.deleteLesson),
      exhaustMap((action) =>
        this.lessonService.remove(action.idToken, action.lessonId).pipe(
          map((lesson) => {
            if (lesson != undefined && lesson != null) {
              return LessonActions.deleteSuccess({ deletedLesson: lesson });
            } else {
              return LessonActions.deleteFailure({ error: 'delete failure' });
            }
          }),
          catchError((error) => of(LessonActions.deleteFailure({ error })))
        )
      )
    )
  );
}
