import { Review } from "src/app/models/Reivew.model";


export interface ReviewState {
    reviewDetail: Review;
    // reviewDetail: Review;
    isLoading: boolean;
    isSuccess: boolean;
    errorMessage: string;
    isGetLoading: boolean;
    isGetSuccess: boolean;
    getErrorMessage: string;
    isCreating: boolean;
    isCreateSuccess: boolean;
    createErrorMessage: string;
    isUpdating: boolean;
    isUpdateSuccess: boolean;
    updateErrorMessage: string;
}