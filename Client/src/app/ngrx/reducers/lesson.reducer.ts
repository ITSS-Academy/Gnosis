import { createReducer, on } from '@ngrx/store';
import { LessonState } from '../states/lesson.state';
import * as LessonActions from '../actions/lesson.actions';
import { Lesson } from 'src/app/models/lesson.model';

export const initualState: LessonState = {
  lessons: <Lesson[]>{},
  isGetting: false,
  isGetSuccess: false,
  getMessError: '',
  isCreating: false,
  isCreateSuccess: false,
  createMessError: '',
  isUpdating: false,
  isUpdateSuccess: false,
  updateMessError: '',
  isDeleting: false,
  isDeleteSuccess: false,
  deleteMessError: '',
};

export const lessonReducer = createReducer(
  initualState,
  on(LessonActions.getAllByCourseId, (state, action) => {
    console.log(action.type);
    let newState: LessonState = {
      ...state,
      isGetting: true,
      isGetSuccess: false,
      getMessError: '',

    };
    return newState;
  }),
  on(LessonActions.getAllByCourseIdSuccess, (state, action) => {
    console.log(action.type);
    let newState: LessonState = {
      ...state,
      isGetting: false,
      isGetSuccess: true,
      lessons: action.lessons,
    };
    return newState;
  }),
  on(LessonActions.getAllByCourseIdFailure, (state, action) => {
    console.log(action.type);
    let newState: LessonState = {
      ...state,
      isGetting: false,
      isGetSuccess: false,
      getMessError: action.error,
    };
    console.log(newState.getMessError);
    return newState;
  }),
  on(LessonActions.create, (state, action) => {
    console.log(action.type);
    let newState: LessonState = {
      ...state,
      isCreating: true,
      isCreateSuccess: false,
      createMessError: '',
    };
    return newState;
  }),
  on(LessonActions.createSuccess, (state, action) => {
    console.log(action.type);
    let newState: LessonState = {
      ...state,
      isCreating: false,
      isCreateSuccess: true,
    };
    return newState;
  }),
  on(LessonActions.createFailure, (state, action) => {
    console.log(action.type);
    let newState: LessonState = {
      ...state,
      isCreating: false,
      isCreateSuccess: false,
      createMessError: action.error,
    };
    return newState;
  }),
  on(LessonActions.update, (state, action) => {
    console.log(action.type);
    let newState: LessonState = {
      ...state,
      isUpdating: true,
      isUpdateSuccess: false,
      updateMessError: '',
    };
    return newState;
  }),
  on(LessonActions.updateSuccess, (state, action) => {
    console.log(action.type);
    let newState: LessonState = {
      ...state,
      isUpdating: false,
      isUpdateSuccess: true,
    };
    return newState;
  }),
  on(LessonActions.updateFailure, (state, action) => {
    console.log(action.type);
    let newState: LessonState = {
      ...state,
      isUpdating: false,
      isUpdateSuccess: false,
      updateMessError: action.error,
    };
    return newState;
  }),
  on(LessonActions.deleteLesson, (state, action) => {
    console.log(action.type);
    let newState: LessonState = {
      ...state,
      isDeleting: true,
      isDeleteSuccess: false,
      deleteMessError: '',
    };
    return newState;
  }),

  on(LessonActions.deleteSuccess, (state, action) => {
    console.log(action.type);
    let newState: LessonState = {
      ...state,
      isDeleting: false,
      isDeleteSuccess: true,
    };
    return newState;
  }),
  on(LessonActions.deleteFailure, (state, action) => {
    console.log(action.type);
    let newState: LessonState = {
      ...state,
      isDeleting: false,
      isDeleteSuccess: false,
      deleteMessError: action.error,
    };
    return newState;
  }),
  on(LessonActions.clearState, (state, action) => {
    console.log(action.type);
    let newState: LessonState = {
      ...state,
      isCreating: false,
      isCreateSuccess: false,
      createMessError: '',
      isUpdating: false,
      isUpdateSuccess: false,
      updateMessError: '',
      isDeleting: false,
      isDeleteSuccess: false,
      deleteMessError: '',
    };
    return newState;
  })
);
