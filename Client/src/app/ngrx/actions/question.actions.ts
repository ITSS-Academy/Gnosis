import { createAction, props } from '@ngrx/store';
import { Question } from 'src/app/models/question.model';

export const getAllByQuizId = createAction(
  '[Question] get all question by quiz id',
  props<{ idToken: string; quizId: string }>()
);
export const getAllByQuizIdSuccess = createAction(
  '[Question] get all question by quiz id success',
  props<{ questions: Question[] }>()
);
export const getAllByQuizIdFailure = createAction(
  '[Question] get all question by quiz id failure',
  props<{ error: string }>()
);

export const create = createAction(
  '[Question] create ',
  props<{ idToken: string; question: Question }>()
);

export const createSuccess = createAction(
  '[Question] create success',
  props<{ newQuestion: Question }>()
);
export const createFailure = createAction(
  '[Question] create failure',
  props<{ error: string }>()
);
export const remove = createAction(
  '[Question] remove ',
  props<{ idToken: string; questionId: string }>()
);

export const removeSuccess = createAction(
  '[Question] remove success',
  props<{ removedQuestion: Question }>()
);

export const removeFailure = createAction(
  '[Question] remove failure',
  props<{ error: string }>()
);
export const clearState = createAction('[Question] Clear State');
