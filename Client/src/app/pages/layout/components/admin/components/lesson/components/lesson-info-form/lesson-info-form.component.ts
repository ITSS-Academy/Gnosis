import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Lesson } from 'src/app/models/lesson.model';

@Component({
  selector: 'app-lesson-info-form',
  templateUrl: './lesson-info-form.component.html',
  styleUrls: ['./lesson-info-form.component.less'],
})
export class LessonInfoFormComponent {
  @Input('lesson') lesson: null | Lesson = null;
  @Output('toggle') toggleEvent: EventEmitter<boolean> = new EventEmitter();
  @Output('submit') submitEvent: EventEmitter<Lesson> = new EventEmitter();

  isDisable = true;

  lessonForm: FormGroup = new FormGroup({
    //^?
    _id: new FormControl({ value: '', disabled: true }, Validators.required),
    title: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl(null, Validators.required),
    img: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    if (this.lesson != null) {
      this.lessonForm = new FormGroup({
        _id: new FormControl(
          { value: this.lesson._id, disabled: true },
          Validators.required
        ),
        courseId: new FormControl(
          { value: this.lesson.courseId, disabled: true },
          Validators.required
        ),
        title: new FormControl(this.lesson.title, Validators.required),
        description: new FormControl(
          this.lesson.description,
          Validators.required
        ),
      });
    }
  }

  toggle(toggle: boolean) {
    this.toggleEvent.emit(toggle);
  }

  updateLesson() {
    let newLessonForm: Lesson = {
      ...this.lessonForm.value,
      _id: this.lesson?._id,
      courseId: this.lesson?.courseId,
      content: this.lesson?.content,
    };
    this.submitEvent.emit(newLessonForm);
  }
}
