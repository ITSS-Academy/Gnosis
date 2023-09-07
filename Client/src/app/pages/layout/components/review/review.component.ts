import { Component, Inject, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiAlertService } from '@taiga-ui/core';
import { Observable, Subscription, interval, takeWhile } from 'rxjs';
import { Review } from 'src/app/models/Reivew.model';
import { AuthState } from 'src/app/ngrx/states/auth.state';
import { ReviewState } from 'src/app/ngrx/states/review.state';
import * as ReviewAction from 'src/app/ngrx/actions/review.actions';
import { QuestionState } from 'src/app/ngrx/states/question.state';
import { Question } from 'src/app/models/question.model';
import * as QuestionAction from 'src/app/ngrx/actions/question.actions';
@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.less']
})
export class ReviewComponent implements OnInit {

  review$: Observable<Review> = this.store.select(
    'review',
    'reviewDetail');
  question$: Observable<Question[]> = this.store.select('question', 'questions');
  idToken$: Observable<string> = this.store.select('auth', 'idToken');
  questionList: any[] = [];
  currentquestion: number = 0;

  counter: number = 600;
  timerSubscription: Subscription | undefined;
  formattedTime: string = '';
  answered: boolean = false;

  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private router: Router,
    private route: ActivatedRoute,

    private store: Store<{
      question: QuestionState;
      review: ReviewState;
      auth: AuthState;
    }>

  ) {


  }

  backhome() {
    this.router.navigate(['/base/home']);

  }

  backcourse() {
    this.router.navigate(['/base/home/course'])
  }

  ngOnInit(): void {
    this.questionList.forEach(question => {
      question.selectedOptionIndex = null;
    });


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
              ReviewAction.get({ idToken: value, id })
            );
          }
          console.log(id);
        });
      }
    });
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
      ]

    });
  }



  selectOption(questionIndex: number, optionIndex: number): void {
    this.questionList[questionIndex].selectedOptionIndex = optionIndex;
    this.answered = true;

    if (questionIndex === this.currentquestion) {
      this.currentquestion++;
    }
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
