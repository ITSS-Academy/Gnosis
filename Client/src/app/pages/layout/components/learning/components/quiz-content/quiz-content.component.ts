import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiAlertService } from '@taiga-ui/core';
import { Quiz } from 'src/app/models/quiz.model';

@Component({
  selector: 'app-quiz-content',
  templateUrl: './quiz-content.component.html',
  styleUrls: ['./quiz-content.component.less'],
})
export class QuizContentComponent implements OnInit {
  // review$: Observable<Review> = this.store.select(
  //   'review',
  //   'reviewDetail');

  // idToken$: Observable<string> = this.store.select('auth', 'idToken');
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
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {}

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
