import { createReducer, on } from '@ngrx/store';
import * as CourseActions from '../actions/course.actions';
import { CourseState } from '../states/course.state';
import { Course } from 'src/app/models/course.model';

export const initualState: CourseState = {
  isLoading: false,
  isSuccess: false,
  isDelLoading: false,
  isDelSuccess: false,
  delErrMess: '',
  isAddSuccess: false,
  isAddLoading: false,
  addErrMess: '',
  isUpSuccess: false,
  isUpLoading: false,
  updateErrMess: '',
  courseList: [],
  courseDetail: <Course>{},
  error: '',
  isGetLoading: false,
  isGetSuccess: false,
  getErrMess: '',
};
export const courseReducer = createReducer(
  initualState,
  on(CourseActions.get, (state, action) => {
    let newState: CourseState = {
      ...state,
      isLoading: true,
      isSuccess: false,
      error: '',
      courseList: [],
    };
    return newState;
  }),
  on(CourseActions.getSuccess, (state, action) => {
    let newState: CourseState = {
      ...state,
      isLoading: false,
      isSuccess: true,
      courseList: action.courseList,
    };
    return newState;
  }),

  on(CourseActions.getFailure, (state, action) => {
    let newState: CourseState = {
      ...state,
      isLoading: false,
      isSuccess: false,
      error: action.error,
    };
    return newState;
  }),

  on(CourseActions.getCourseDetail, (state, action) => {
    let newState: CourseState = {
      ...state,
      isLoading: true,
      isSuccess: false,
      error: '',
      courseDetail: <Course>{},
    };
    return newState;
  }),
  on(CourseActions.getCourseDetailSuccess, (state, action) => {
    let newState: CourseState = {
      ...state,
      isLoading: false,
      isSuccess: true,
      courseDetail: action.courseDetail,
    };
    return newState;
  }),
  on(CourseActions.getCourseDetailFailure, (state, action) => {
    let newState: CourseState = {
      ...state,
      isLoading: false,
      isSuccess: false,
      error: action.error,
    };
    return newState;
  }),
  on(CourseActions.create, (state, action) => {
    let newState: CourseState = {
      ...state,
      isAddLoading: true,
      isAddSuccess: false,
      addErrMess: '',
    };
    return newState;
  }),
  on(CourseActions.createSuccess, (state, action) => {
    let newState: CourseState = {
      ...state,
      isAddLoading: false,
      isAddSuccess: true,
    };
    return newState;
  }),
  on(CourseActions.createFailure, (state, action) => {
    let newState: CourseState = {
      ...state,
      isAddLoading: false,
      isAddSuccess: false,
      addErrMess: action.error,
    };
    return newState;
  }),
  on(CourseActions.update, (state, action) => {
    let newState: CourseState = {
      ...state,
      isUpLoading: true,
      isUpSuccess: false,
      updateErrMess: '',
    };
    return newState;
  }),
  on(CourseActions.updateSuccess, (state, action) => {
    let newState: CourseState = {
      ...state,
      isUpLoading: false,
      isUpSuccess: true,
    };
    return newState;
  }),
  on(CourseActions.updateFailure, (state, action) => {
    let newState: CourseState = {
      ...state,
      isUpLoading: false,
      isUpSuccess: false,
      updateErrMess: action.error,
    };
    return newState;
  }),
  on(CourseActions.remove, (state, action) => {
    let newState: CourseState = {
      ...state,
      isDelLoading: true,
      isDelSuccess: false,
      updateErrMess: '',
    };
    return newState;
  }),
  on(CourseActions.removeSuccess, (state, action) => {
    let newState: CourseState = {
      ...state,
      isDelLoading: false,
      isDelSuccess: true,
    };
    return newState;
  }),
  on(CourseActions.removeFailure, (state, action) => {
    let newState: CourseState = {
      ...state,
      isDelLoading: false,
      isDelSuccess: false,
      delErrMess: action.error,
    };
    return newState;
  }),

  //get by user
  on(CourseActions.getByUser, (state, action) => {
    let newState = {
      ...state,
      isGetLoading: true,
      isGetSuccess: false,
      getErrMess: '',
      courseList: [],
    };
    return newState;
  }),

  on(CourseActions.getByUserSuccess, (state, action) => {
    let newState = {
      ...state,
      isGetLoading: false,
      isGetSuccess: true,
      courseList: action.courseList,
    };
    return newState;
  }),

  on(CourseActions.getByUserFailure, (state, action) => {
    let newState = {
      ...state,
      isGetLoading: false,
      isGetSuccess: false,
      getErrMess: action.getErrMess,
    };
    return newState;
  }),
  on(CourseActions.clearState, (state, action) => {
    let newState: CourseState = {
      ...state,
      isGetLoading: false,
      isGetSuccess: false,
      getErrMess: '',
      isLoading: false,
      isSuccess: false,
      isDelLoading: false,
      isDelSuccess: false,
      delErrMess: '',
      isAddSuccess: false,
      isAddLoading: false,
      addErrMess: '',
      isUpSuccess: false,
      isUpLoading: false,
      updateErrMess: '',
      courseList: [],
      courseDetail: <Course>{},
      error: '',
    };
    return newState;
  })
);
