import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import * as QuizBankActions from '../actions/quizBank.actions';
import { QuizBankService } from 'src/app/services/quizBank/quiz-bank.service';

@Injectable()
export class QuizBankEffects {
  constructor(
    private quizBankService: QuizBankService,
    private action$: Actions
  ) {}

  add$ = createEffect(() =>
    this.action$.pipe(
      ofType(QuizBankActions.add),
      switchMap((action) =>
        this.quizBankService.add(action.idToken, action.quizBank).pipe(
          map((newQuizBank) => {
            if (newQuizBank != undefined && newQuizBank != null) {
              if (newQuizBank.message) {
                return QuizBankActions.addFailure({
                  error: newQuizBank.message,
                });
              }
              return QuizBankActions.addSuccess({ newQuizBank });
            } else {
              return QuizBankActions.addFailure({
                error: 'add failure',
              });
            }
          }),
          catchError((error) => of(QuizBankActions.addFailure({ error })))
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.action$.pipe(
      ofType(QuizBankActions.update),
      exhaustMap((action) =>
        this.quizBankService.update(action.idToken, action.quizBank).pipe(
          map((quizBank) => {
            if (quizBank != undefined && quizBank != null) {
              if (quizBank.message) {
                return QuizBankActions.updateFailure({
                  error: quizBank.message,
                });
              }
              return QuizBankActions.updateSuccess({ quizBank });
            } else {
              return QuizBankActions.updateFailure({
                error: 'update failure',
              });
            }
          }),
          catchError((error) => of(QuizBankActions.updateFailure({ error })))
        )
      )
    )
  );
}
