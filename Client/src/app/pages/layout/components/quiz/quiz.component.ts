import { Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
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
export class QuizComponent implements OnInit {
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
  options: any;
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
    // this.questionList.forEach(question => {
    //   question.selectedOptionIndex = null;
    // });


    const timer$ = interval(1000);
    this.timerSubscription = timer$.pipe(
      takeWhile(() => this.counter > 0)
    ).subscribe(() => {
      this.counter--;
      this.formatTime();
    });

    this.formatTime();



    this.route.paramMap.subscribe((params) => {
      const id = '64f6239327c8b5a3a16aac14';
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
  selectOption(
    option: any,
  ) {
    this.options = option;
  }




  submit() {

    const review: Review = {
      _id: '',
      quizId: '64f6239327c8b5a3a16aac14',
      profileId: '64f4c670157abb0afd8bb2bb',
      // score: 0,
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

// 

