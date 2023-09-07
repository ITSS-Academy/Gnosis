import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { TuiAlertService } from '@taiga-ui/core';
import { Observable, Subscription, interval, takeWhile } from 'rxjs';

import { AuthState } from 'src/app/ngrx/states/auth.state';
import { QuestionState } from 'src/app/ngrx/states/question.state';
import { ReviewState } from 'src/app/ngrx/states/review.state';
import * as QuestionAction from 'src/app/ngrx/actions/question.actions';
import * as ReviewAction from 'src/app/ngrx/actions/review.actions';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { quizBank } from 'src/app/models/quizBank.model';
import { Quiz } from 'src/app/models/quiz.model';
import { Review } from 'src/app/models/Reivew.model';
import { Question } from 'src/app/models/question.model';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.less']
})
export class QuizComponent implements OnInit, OnDestroy {
  @Input('review') review: null | Review = null;

  question$: Observable<Question[]> = this.store.select('question', 'questions');
  review$: Observable<Review> = this.store.select('review', 'reviewDetail');
  idToken$: Observable<string> = this.store.select('auth', 'idToken');
  questionList: any[] = [];
  // currentquestion: number = 0;

  questionTitle: string = '';
  counter: number = 0;
  timerSubscription: Subscription | undefined;
  formattedTime: string = '';

  // answered: boolean = false;

  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private router: Router,
    private route: ActivatedRoute,

    private store: Store<{
      question: QuestionState;
      review: ReviewState;
      auth: AuthState;
    }>
  ) { }

  quizBank: quizBank[] = [];
  backhome() {
    this.router.navigate(['/base/home']);

  }

  backcourse() {
    this.router.navigate(['/base/home/course'])
  }

  ngOnInit(): void {


    // this.store.select('review', 'isCreating').
    // subscribe((isCreating) => {
    //   if (isCreating) {
    //     this.alerts.open('Create review ...', {
    //       status: 'success',
    //     }).subscribe();
    //   }

    // })
    // this.store.select('review', 'isCreateSuccess').
    // subscribe((isCreateSuccess) => {
    //   if (isCreateSuccess) {
    //     this.alerts.open('Create review success', {
    //       status: 'success',
    //     }).subscribe();
    //   }
    // })
    // this.store.select('review', 'createErrorMessage').
    // subscribe((createErrorMessage) => {
    //   if (createErrorMessage) {
    //     this.alerts.open(createErrorMessage, {
    //       status: 'error',
    //     }).subscribe();
    //   }
    // })


    const timer$ = interval(1000);
    this.timerSubscription = timer$.pipe(
      takeWhile(() => this.counter > 0)
    ).subscribe(() => {
      this.counter--;
      this.formatTime();
    });

    this.formatTime();

    this.route.paramMap.subscribe((params) => {
      const id = '64f96fd6cb126767ffa79263'
      if (id) {
        this.idToken$.subscribe((value) => {
          if (value) {
            this.store.dispatch(
              QuestionAction.getAllByQuizId({ idToken: value, quizId: id })
            );
          }
          console.log(id);
        });
      }
    });

    this.question$.subscribe((value) => {
      this.questionList = [
        ...value
      ];
      this.counter = this.questionList.length * 60;

    })
  }
  options: Array<string> = [];
  selectOption = (option: string) => {
    for (let i = 0; i < this.questionList.length; i++) {
      for (let j = 0; j < this.questionList[i].quizBank.options.length; j++) {
        if (this.questionList[i].quizBank.options[j] === option) {
          this.options.push(option);
        }
      }
      console.log(this.options);
    }
  };

  submit() {

    const review: Review = {
      _id: '',
      quizId: '64f96fd6cb126767ffa79263',
      profileId: '64f4c670157abb0afd8bb2bb',
      test: this.questionList.map((question) => {
        return {
          answer: this.options,
          quizBankId: question.quizBank._id,
        }
      })
    };
    this.idToken$.subscribe((value) => {
      if (value) {
        this.store.dispatch(
          ReviewAction.create({ idToken: value, review })
        );
        console.log(review);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  formatTime(): void {
    const minutes = Math.floor(this.counter / 60);
    const seconds = this.counter % 60;
    this.formattedTime = `${this.formatNumber(minutes)}:${this.formatNumber(seconds)}`;
  }

  formatNumber(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }
}



