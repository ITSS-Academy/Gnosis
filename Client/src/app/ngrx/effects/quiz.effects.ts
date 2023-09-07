import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import * as QuizActions from '../actions/quiz.actions';
import { QuizService } from 'src/app/services/quiz/quiz.service';

@Injectable()
export class QuizEffects {
  constructor(private quizService: QuizService, private action$: Actions) {}
  getById$ = createEffect(() =>
    this.action$.pipe(
      ofType(QuizActions.get),
      exhaustMap((action) =>
        this.quizService.getById(action.idToken, action.id).pipe(
          map((quiz) => {
            if (quiz != undefined && quiz != null) {
              return QuizActions.getSuccess({ quiz });
            } else {
              return QuizActions.getFailure({
                error: 'Quiz is undefined or null',
              });
            }
          }),
          catchError((error) => {
            console.log(error);
            return of(QuizActions.getFailure({ error }));
          })
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.action$.pipe(
      ofType(QuizActions.create),
      exhaustMap((action) =>
        this.quizService.create(action.idToken, action.quiz).pipe(
          map((quiz) => {
            if (quiz != undefined && quiz != null) {
              console.log(quiz);
              return QuizActions.createSuccess({ newQuiz: quiz });
            } else {
              return QuizActions.createFailure({ error: 'create failure' });
            }
          }),
          catchError((error) => of(QuizActions.createFailure({ error })))
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.action$.pipe(
      ofType(QuizActions.update),
      exhaustMap((action) =>
        this.quizService.update(action.idToken, action.quiz).pipe(
          map((quiz) => {
            if (quiz != undefined && quiz != null) {
              console.log(quiz);
              return QuizActions.updateSuccess({ updatedQuiz: quiz });
            } else {
              return QuizActions.updateFailure({ error: 'update failure' });
            }
          }),
          catchError((error) => of(QuizActions.updateFailure({ error })))
        )
      )
    )
  );
}
