import { createAction, props } from '@ngrx/store';
import { Lesson } from 'src/app/models/lesson.model';

//get lessons by course id
export const getAllByCourseId = createAction(
  '[Lesson] get all by course id',
  props<{ idToken: string; courseId: string }>()
);
export const getAllByCourseIdSuccess = createAction(
  '[Lesson] get all by course id success',
  props<{ lessons: any }>()
  
);
export const getAllByCourseIdFailure = createAction(
  '[Lesson] get all by course id failure',
  props<{ error: string }>()
);
//create new lesson
export const create = createAction(
  '[Lesson] create ',
  props<{ idToken: string; lesson: Lesson }>()
);
export const createSuccess = createAction(
  '[Lesson] create success',
  props<{ newLesson: Lesson }>()
);
export const createFailure = createAction(
  '[Lesson] create failure',
  props<{ error: string }>()
);
//update  lesson
export const update = createAction(
  '[Lesson] update ',
  props<{ idToken: string; lesson: Lesson }>()
);
export const updateSuccess = createAction(
  '[Lesson] update success',
  props<{ updatedLesson: Lesson }>()
);
export const updateFailure = createAction(
  '[Lesson] update failure',
  props<{ error: string }>()
);
//delete lesson
export const deleteLesson = createAction(
  '[Lesson] delete ',
  props<{ idToken: string; lessonId: string }>()
);
export const deleteSuccess = createAction(
  '[Lesson] delete success',
  props<{ deletedLesson: Lesson }>()
);
export const deleteFailure = createAction(
  '[Lesson] delete failure',
  props<{ error: string }>()
);
export const clearState = createAction('[Lesson] Clear State');
