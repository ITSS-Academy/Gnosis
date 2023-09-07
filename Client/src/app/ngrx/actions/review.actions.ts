import { createAction, props } from '@ngrx/store';
import { Review } from 'src/app/models/Reivew.model';

export const get = createAction(
    '[Review] get ',
    props<{ idToken: string; id: string }>()
);

export const getSuccess = createAction(
    '[Review] get success',
    props<{ review: Review }>()
);

export const getFailure = createAction(
    '[Review] get failure',
    props<{ error: string }>()
);

export const create = createAction(
    '[Review] create ',
    props<{ idToken: string; review: Review }>()
);

export const createSuccess = createAction(
    '[Review] create success',
    props<{ newReview: Review }>()
);

export const createFailure = createAction(
    '[Review] create failure',
    props<{ error: string }>()
);

export const update = createAction(
    '[Review] update ',
    props<{ idToken: string; review: Review }>()
);

export const updateSuccess = createAction(
    '[Review] update success',
    props<{ updatedReview: Review }>()
);

export const updateFailure = createAction(
    '[Review] update failure',
    props<{ error: string }>()
);



