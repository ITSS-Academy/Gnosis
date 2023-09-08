import * as QuizBankActions from '../actions/quizBank.actions';
import { createReducer, on } from '@ngrx/store';
import { quizBankState } from '../states/quizBank.state';

export const initialState: quizBankState = {
  newQuizBank: null,
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

export const quizBankReducer = createReducer(
  initialState,
  on(QuizBankActions.add, (state, action) => {
    return {
      ...state,
      isCreateLoading: true,
      isCreateSuccess: false,
      createMessError: '',
      newQuizBank: null,
    };
  }),
  on(QuizBankActions.addSuccess, (state, action) => {
    return {
      ...state,
      isCreateLoading: false,
      isCreateSuccess: true,
      newQuizBank: action.newQuizBank,
    };
  }),
  on(QuizBankActions.addFailure, (state, action) => {
    return {
      ...state,
      isCreateLoading: false,
      isCreateSuccess: false,
      createMessError: action.error,
    };
  }),

  on(QuizBankActions.update, (state, action) => {
    return {
      ...state,
      isUpdateLoading: true,
      isUpdateSuccess: false,
      updateMessError: '',
    };
  }),
  on(QuizBankActions.updateSuccess, (state, action) => {
    return {
      ...state,
      isUpdateLoading: false,
      isUpdateSuccess: true,
    };
  }),
  on(QuizBankActions.updateFailure, (state, action) => {
    return {
      ...state,
      isUpdateLoading: false,
      isUpdateSuccess: false,
      updateMessError: action.error,
    };
  }),
  on(QuizBankActions.clearState, (state, action) => {
    return <quizBankState>{
      ...state,
      isCreateLoading: false,
      isCreateSuccess: false,
      createMessError: '',
      isUpdateLoading: false,
      isUpdateSuccess: false,
      updateMessError: '',
      newQuizBank: null,
    };
  })
);
