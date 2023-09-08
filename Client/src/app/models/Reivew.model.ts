import { quizBank } from "./quizBank.model";

export interface Review {
    _id: string,
    quizId: string,
    profileId: string,
    score: number,
    test: Answer[]
}

export interface Answer {
    answer: string[];
    quizBankId: string;
}