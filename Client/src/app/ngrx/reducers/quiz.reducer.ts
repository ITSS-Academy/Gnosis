import { createReducer, on } from '@ngrx/store';
import * as QuizActions from '../actions/quiz.actions';
import { QuizState } from '../states/quiz.state';

export const initialState: QuizState = {
  quiz: null,
  isGetLoading: false,
  isGetSuccess: false,
  getMessError: '',
  isCreateLoading: false,
  isCreateSuccess: false,
  createMessError: '',
  isUpdateLoading: false,
  isUpdateSuccess: false,
  updateMessError: '',
};

export const quizReducer = createReducer(
  initialState,
  on(QuizActions.get, (state, action) => {
    return {
      ...state,
      isGetLoading: true,
      isGetSuccess: false,
      getMessError: '',
    };
  }),
  on(QuizActions.getSuccess, (state, action) => {
    return {
      ...state,
      quiz: action.quiz,
      isGetLoading: false,
      isGetSuccess: true,
    };
  }),
  on(QuizActions.getFailure, (state, action) => {
    return {
      ...state,
      isGetLoading: false,
      isGetSuccess: false,
      getMessError: action.error,
    };
  }),
  on(QuizActions.create, (state, action) => {
    return {
      ...state,
      isCreateLoading: true,
      isCreateSuccess: false,
      createMessError: '',
    };
  }),
  on(QuizActions.createSuccess, (state, action) => {
    return {
      ...state,
      quiz: action.newQuiz,
      isCreateLoading: false,
      isCreateSuccess: true,
    };
  }),
  on(QuizActions.createFailure, (state, action) => {
    return {
      ...state,
      isCreateLoading: false,
      isCreateSuccess: false,
      createMessError: action.error,
    };
  }),
  on(QuizActions.update, (state, action) => {
    return {
      ...state,
      isUpdateLoading: true,
      isUpdateSuccess: false,
      updateMessError: '',
    };
  }),
  on(QuizActions.updateSuccess, (state, action) => {
    return {
      ...state,
      quiz: action.updatedQuiz,
      isUpdateLoading: false,
      isUpdateSuccess: true,
    };
  }),
  on(QuizActions.updateFailure, (state, action) => {
    return {
      ...state,
      isUpdateLoading: false,
      isUpdateSuccess: false,
      updateMessError: action.error,
    };
  }),
  on(QuizActions.clearState, (state, action) => {
    return <QuizState>{
      ...state,
      isGetLoading: false,
      isGetSuccess: false,
      getMessError: '',
      isCreateLoading: false,
      isCreateSuccess: false,
      createMessError: '',
      isUpdateLoading: false,
      isUpdateSuccess: false,
      updateMessError: '',
      quiz: null,
    };
  })
);
