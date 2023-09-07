import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  TuiAlertService,
  TuiDialogContext,
  TuiDialogService,
} from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { Quiz } from 'src/app/models/quiz.model';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/ngrx/states/auth.state';
import { QuizState } from 'src/app/ngrx/states/quiz.state';
import * as QuizActions from 'src/app/ngrx/actions/quiz.actions';
import { Subscription } from 'rxjs';
import * as QuestionActions from 'src/app/ngrx/actions/question.actions';
import { QuestionState } from 'src/app/ngrx/states/question.state';
import { quizBank } from 'src/app/models/quizBank.model';
import { quizBankState } from 'src/app/ngrx/states/quizBank.state';
import * as quizBankActions from 'src/app/ngrx/actions/quizBank.actions';
import { Question } from 'src/app/models/question.model';

@Component({
  selector: 'app-quiz-editor',
  templateUrl: './quiz-editor.component.html',
  styleUrls: ['./quiz-editor.component.less'],
})
export class QuizEditorComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private router: Router,
    private readonly dialogs: TuiDialogService,
    private store: Store<{
      auth: AuthState;
      quiz: QuizState;
      question: QuestionState;
      quizBank: quizBankState;
    }>
  ) {
    this.items.push({
      caption: 'Current',
      routerLink: this.router.url,
    });
  }

  //update func
  updateQuizBankContent(event: Question) {
    if (this.selectedQuestion != null) {
      this.store.dispatch(
        quizBankActions.update({
          idToken: this.idToken,
          quizBank: event.quizBank,
        })
      );
    }
  }

  updateQuizContent($event: Quiz) {
    this.store.dispatch(
      QuizActions.update({ idToken: this.idToken, quiz: $event })
    );
  }

  save() {
    this.isSave = true;
    setInterval(() => {
      this.isSave = false;
    }, 2000);
  }

  quiz: any = {
    content: ``,
    courseId: this.router.url.split('/')[4],
    duration: 0,
    total: 0,
    title: '0',
    passCond: 0,
  };
  editQuiz() {
    this.selectedQuestion = null;
  }

  //get func
  selectedQuestion: Question | null = null;
  selectQuestion(question: Question) {
    if (this.selectedQuestion?._id === question._id) {
      this.alerts
        .open('Question already selected !!!', { status: 'info' })
        .subscribe();
      return;
    }
    console.log('selected quest', question);
    this.selectedQuestion = question;
  }

  //add xong nhét idquizbank vào addquestion
  add() {
    const newQuizBank: any = {
      question: 'Your question here',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      answerList: ['Option 1'],
      img: '',
    };
    this.store.dispatch(
      quizBankActions.add({
        quizBank: newQuizBank,
        idToken: this.idToken,
      })
    );
  }

  //add func
  questionList: Question[] = [];

  addQuestion(quizBank: quizBank) {
    const newQuestion: any = {
      questionText: 'Your question here',
      correctOption: 0,
      quizBank: quizBank._id,
      ordinalNum: this.questionList.length + 1,
      quizId: this.quiz._id,
    };
    this.store.dispatch(
      QuestionActions.create({
        question: newQuestion,
        idToken: this.idToken,
      })
    );
  }

  //del func
  showWarningDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogs.open(content).subscribe();
  }

  deleteQuestion(i: number) {
    this.store.dispatch(
      QuestionActions.remove({
        idToken: this.idToken,
        questionId: this.questionList[i]._id,
      })
    );
  }

  isPreview: boolean = true;
  isSave: boolean = false;
  idToken = '';
  subscriptions: Subscription[] = [];
  isGetLoading: boolean = false;
  isGettingQuestions: boolean = false;

  items = [
    {
      caption: 'Admin',
      routerLink: '/base/admin',
    },
  ];

  ngOnInit(): void {
    this.subscriptions.push(
      this.store.select('auth', 'idToken').subscribe((idToken) => {
        if (idToken != '' && idToken != null && idToken != undefined) {
          this.idToken = idToken;
          console.log(`quiz's course id: `, this.router.url.split('/')[4]);
          this.store.dispatch(
            QuizActions.get({
              idToken: this.idToken,
              id: this.router.url.split('/')[4],
            })
          );
        }
      }),
      this.store.select('quiz', 'quiz').subscribe((quiz) => {
        if (quiz != null && quiz != undefined) {
          this.quiz = quiz;
          this.store.dispatch(
            QuestionActions.getAllByQuizId({
              idToken: this.idToken,
              quizId: this.quiz._id,
            })
          );
        }
      }),
      this.store.select('quiz', 'isGetLoading').subscribe((isGetLoading) => {
        this.isGetLoading = isGetLoading;
      }),
      this.store.select('quiz', 'isGetSuccess').subscribe((isGetSuccess) => {
        if (isGetSuccess) {
          this.alerts
            .open('Load quiz success !!!', { status: 'success' })
            .subscribe();
        }
      }),
      this.store.select('quiz', 'getMessError').subscribe((getMessError) => {
        if (getMessError != '') {
          this.alerts.open(getMessError, { status: 'error' }).subscribe();
          if (getMessError == 'Quiz is undefined or null') {
            this.store.dispatch(
              QuizActions.create({
                idToken: this.idToken,
                quiz: this.quiz as Quiz,
              })
            );
          }
        }
      }),
      this.store
        .select('quiz', 'isCreateLoading')
        .subscribe((isCreateLoading) => {
          if (isCreateLoading) {
            this.alerts
              .open('Creating quiz...', { status: 'info' })
              .subscribe();
          }
        }),
      this.store
        .select('quiz', 'isCreateSuccess')
        .subscribe((isCreateSuccess) => {
          if (isCreateSuccess) {
            this.alerts
              .open('Create quiz success !!!', { status: 'success' })
              .subscribe();
            this.store.dispatch(
              QuizActions.get({
                idToken: this.idToken,
                id: this.router.url.split('/')[4],
              })
            );
          }
        }),
      this.store
        .select('quiz', 'createMessError')
        .subscribe((createMessError) => {
          if (createMessError != '') {
            this.alerts.open(createMessError, { status: 'error' }).subscribe();
          }
        }),
      this.store
        .select('quiz', 'isUpdateSuccess')
        .subscribe((isUpdateSuccess) => {
          if (isUpdateSuccess) {
            this.alerts
              .open('Update quiz success !!!', { status: 'success' })
              .subscribe();
          }
        }),
      this.store
        .select('quiz', 'updateMessError')
        .subscribe((updateMessError) => {
          if (updateMessError != '') {
            this.alerts.open(updateMessError, { status: 'error' }).subscribe();
          }
        }),
      this.store.select('question', 'isDeleting').subscribe((val) => {
        if (val) {
          this.alerts

            .open('Delete question success !!!', { status: 'success' })
            .subscribe();
          this.store.dispatch(
            QuestionActions.getAllByQuizId({
              idToken: this.idToken,
              quizId: this.quiz._id,
            })
          );
        }
      }),
      this.store.select('question', 'isCreatedSuccess').subscribe((val) => {
        if (val) {
          console.log('alo');
          this.alerts
            .open('Create question success !!!', { status: 'success' })
            .subscribe();
          this.store.dispatch(
            QuestionActions.getAllByQuizId({
              idToken: this.idToken,
              quizId: this.quiz._id,
            })
          );
        }
      }),
      this.store.select('question', 'isGetLoading').subscribe((val) => {
        this.isGettingQuestions = val;
      }),
      this.store.select('question', 'isGetSuccess').subscribe((val) => {
        if (val) {
          this.alerts
            .open('List questons success !!!!', { status: 'success' })
            .subscribe();
        }
      }),
      this.store.select('question', 'getMessError').subscribe((val) => {
        if (val != null && val != undefined && val != '') {
          this.alerts.open(val, { status: 'error' }).subscribe();
        }
      }),
      this.store.select('question', 'questions').subscribe((val) => {
        console.log('questionList: ', val);
        if (val != null && val != undefined && val.length > 0) {
          this.questionList = [...val];
          console.log('questionList: ', this.questionList);
        }
      }),
      this.store.select('quizBank', 'newQuizBank').subscribe((newQuizBank) => {
        if (newQuizBank != null) {
          this.alerts.open('Add question success !!!', { status: 'success' });
          this.addQuestion(newQuizBank);
        }
      }),
      this.store.select('quizBank', 'isUpdateSuccess').subscribe((val) => {
        if (val) {
          this.alerts
            .open('Update question success !!!', { status: 'success' })
            .subscribe();
          this.store.dispatch(
            QuestionActions.getAllByQuizId({
              idToken: this.idToken,
              quizId: this.quiz._id,
            })
          );
        }
      }),
      this.store.select('quizBank', 'updateMessError').subscribe((err) => {
        if (err != null && err != undefined && err != '') {
          this.alerts.open(err, { status: 'error' }).subscribe();
        }
      }),
      this.store
        .select('quizBank', 'createMessError')
        .subscribe((createMessError) => {
          if (createMessError != '') {
            this.alerts.open(createMessError, { status: 'error' }).subscribe();
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.store.dispatch(quizBankActions.clearState());
    this.store.dispatch(QuizActions.clearState());
    this.store.dispatch(QuestionActions.clearState());
  }
}
