import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiAlertService } from '@taiga-ui/core';
import { Observable, Subscription } from 'rxjs';
import { Review } from 'src/app/models/Reivew.model';
import { Quiz } from 'src/app/models/quiz.model';
import { AuthState } from 'src/app/ngrx/states/auth.state';
import { ReviewState } from 'src/app/ngrx/states/review.state';
import * as ReviewActions from 'src/app/ngrx/actions/review.actions';
@Component({
  selector: 'app-quiz-content',
  templateUrl: './quiz-content.component.html',
  styleUrls: ['./quiz-content.component.less'],
})
export class QuizContentComponent implements OnInit {

  quizForm: FormGroup = new FormGroup({
    _id: new FormControl({ value: '', disabled: true }, Validators.required),
    courseId: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    title: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
    total: new FormControl(0, Validators.required),
    duration: new FormControl(0, Validators.required),
    passCond: new FormControl(0, Validators.required),
  });
  quiz!: Quiz;
  review: Review = <Review>{};
  subscriptions: Subscription[] = [];
  review$: Observable<Review> = this.store.select('review', 'reviewDetail');
  @Input('quiz')
  set quizInput(value: Quiz | null) {
    if (value != null) {
      //binding val
      this.quiz = value;
      this.quizForm.patchValue(value);
    } else {
      this.quiz = <Quiz>{};
    }
  }
  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private router: Router,

    private store: Store<{ review: ReviewState, auth: AuthState; }>
  ) { }
  ngOnInit(): void {
    // this.subscriptions.push(
    //   this.store.select('auth', 'idToken').subscribe((idToken) => {
    //     if (idToken) {
    //       this.store.dispatch(
    //         ReviewActions.get({
    //           idToken: idToken,
    //           id: this.quiz._id,
    //         })
    //       );
    //     }
    //   }));

    // this.review$.subscribe((review) => {
    //   if (review) {
    //     console.log(review);
    //     this.review = review;
    //   }
    // });

  }

  toDoQuiz() {
    this.router.navigate([
      `/base/home/course/${this.quiz.courseId}/quiz/${this.quiz._id}`,
    ]);
  }
  toReview() {
    this.router.navigate([
      `/base/home/course/${this.quiz.courseId}/review/${this.quiz._id}`,
    ]);
  }
}
