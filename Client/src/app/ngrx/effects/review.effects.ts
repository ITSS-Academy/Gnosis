import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ReviewService } from 'src/app/services/review/review.service';
import * as ReviewAction from '../actions/review.actions';

@Injectable()
export class ReviewEffect {
    constructor(private reviewService: ReviewService, private action$: Actions) { }
    get$ = createEffect(() =>
        this.action$.pipe(
            ofType(ReviewAction.get),
            exhaustMap((action) =>
                this.reviewService.getReviewByQuizId(action.idToken, action.id).pipe(
                    map((items) => {
                        console.log(items);
                        if (items != undefined || items != null) {
                            return ReviewAction.getSuccess({ review: items });
                        } else {
                            return ReviewAction.getFailure({
                                error: 'Review is undefined or null',
                            });
                        }
                    }),
                    catchError((error) => of(ReviewAction.getFailure({ error })))
                )
            )
        )
    );
    create$ = createEffect(() =>
        this.action$.pipe(
            ofType(ReviewAction.create),
            exhaustMap((action) =>
                this.reviewService.create(action.idToken, action.review).pipe(
                    map((item) => {
                        if (item != undefined && item != null) {
                            console.log(item);
                            return ReviewAction.createSuccess({ newReview: item });
                        } else {
                            return ReviewAction.createFailure({ error: 'create failure' });
                        }
                    }),
                    catchError((error) => of(ReviewAction.createFailure({ error })))
                )
            )
        )
    );
    update$ = createEffect(() =>
        this.action$.pipe(
            ofType(ReviewAction.update),
            exhaustMap((action) =>
                this.reviewService.update(action.idToken, action.review).pipe(
                    map((item) => {
                        if (item != undefined && item != null) {
                            console.log(item);
                            return ReviewAction.updateSuccess({ updatedReview: item });
                        } else {
                            return ReviewAction.updateFailure({ error: 'update failure' });
                        }
                    }),
                    catchError((error) => of(ReviewAction.updateFailure({ error })))
                )
            )
        )
    );

}

