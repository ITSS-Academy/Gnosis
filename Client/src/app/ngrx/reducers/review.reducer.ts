import { Review } from 'src/app/models/Reivew.model';
import { ReviewState } from '../states/review.state';
import * as ReviewActions from '../actions/review.actions';
import { createReducer, on } from '@ngrx/store';

export const initualState: ReviewState = {
  reviewDetail: <Review>{},
  isLoading: false,
  isSuccess: false,
  errorMessage: '',
  isGetLoading: false,
  isGetSuccess: false,
  getErrorMessage: '',
  isCreating: false,
  isCreateSuccess: false,
  createErrorMessage: '',
  isUpdating: false,
  isUpdateSuccess: false,
  updateErrorMessage: '',
};
export const ReviewReducer = createReducer(
  initualState,
  on(ReviewActions.get, (state, action) => {
    let newState = {
      ...state,
      isGetLoading: true,
      isGetSuccess: false,
      getErrorMessage: '',
    };
    return newState;
  }),
  on(ReviewActions.getSuccess, (state, action) => {
    let newState = {
      ...state,
      isGetLoading: false,
      isGetSuccess: true,
      review: action.review,
    };
    return newState;
  }),
  on(ReviewActions.getFailure, (state, action) => {
    let newState = {
      ...state,
      isGetLoading: false,
      isGetSuccess: false,
      getErrorMessage: action.error,
    };
    return newState;
  }),
  on(ReviewActions.create, (state, action) => {
    let newState = {
      ...state,
      isCreating: true,
      isCreateSuccess: false,
      createErrorMessage: '',
    };
    return newState;
  }),
  on(ReviewActions.createSuccess, (state, action) => {
    let newState = {
      ...state,
      isCreating: false,
      isCreateSuccess: true,
      review: action.newReview,
    };
    return newState;
  }),
  on(ReviewActions.createFailure, (state, action) => {
    let newState = {
      ...state,
      isCreating: false,
      isCreateSuccess: false,
      createErrorMessage: action.error,
    };
    return newState;
  }),
  on(ReviewActions.update, (state, action) => {
    let newState = {
      ...state,
      isUpdating: true,
      isUpdateSuccess: false,
      updateErrorMessage: '',
    };
    return newState;
  }),
  on(ReviewActions.updateSuccess, (state, action) => {
    let newState = {
      ...state,
      isUpdating: false,
      isUpdateSuccess: true,
      review: action.updatedReview,
    };
    return newState;
  }),
  on(ReviewActions.updateFailure, (state, action) => {
    let newState = {
      ...state,
      isUpdating: false,
      isUpdateSuccess: false,
      updateErrorMessage: action.error,
    };
    return newState;
  })
);
