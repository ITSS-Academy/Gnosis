import { Quiz } from './quiz.model';
import { quizBank } from './quizBank.model';

export interface Question {
  questionText: string;
  _id: string;
  quizId: Quiz;
  quizBank: quizBank;
  ordinalNum: number;
  correctOption: number;
}
