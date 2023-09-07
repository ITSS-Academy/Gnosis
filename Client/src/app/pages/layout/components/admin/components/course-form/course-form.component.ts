import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiFileLike } from '@taiga-ui/kit';
import { Observable, Subject, finalize, map, of, switchMap, timer } from 'rxjs';
import { Course } from 'src/app/models/course.model';
import { CloudStorageService } from 'src/app/services/cloud-storage/cloud-storage.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.less'],
})
export class CourseFormComponent {
  @Output('create') createEvent: EventEmitter<Course> = new EventEmitter();
  @Output('update') updateEvent: EventEmitter<Course> = new EventEmitter();
  @Output('toggle') toggleEvent: EventEmitter<boolean> = new EventEmitter();
  @Output('editLessons') editLessonsEvent: EventEmitter<boolean> =
    new EventEmitter();
  @Output('editQuiz') editQuizEvent: EventEmitter<boolean> = new EventEmitter();

  @Input('isEdit') isEdit: boolean = false;
  @Input('course') course: Course | null = null;

  isDisable = true;

  courseForm: FormGroup = new FormGroup({
    _id: new FormControl(
      { value: Date.now().toString(), disabled: true },
      Validators.required
    ),
    name: new FormControl('', Validators.required),
    author: new FormControl(null, Validators.required),
    category: new FormControl(null, Validators.required),
    description: new FormControl(null, Validators.required),
    language: new FormControl(null, Validators.required),
    price: new FormControl(null, Validators.required),
    img: new FormControl(null, Validators.required),
    isReleased: new FormControl(false, Validators.required),
  });

  ngOnInit(): void {
    if (this.isEdit) {
      console.log('course form id:', this.course?._id);
      if (this.course != null) {
        this.courseForm = new FormGroup({
          _id: new FormControl(
            { value: this.course._id, disabled: true },
            Validators.required
          ),
          name: new FormControl(this.course.name, Validators.required),
          author: new FormControl(this.course.author, Validators.required),
          category: new FormControl(this.course.category, Validators.required),
          description: new FormControl(
            this.course.description,
            Validators.required
          ),
          language: new FormControl(this.course.language, Validators.required),
          price: new FormControl(this.course.price, Validators.required),
          img: new FormControl(this.course.img, Validators.required),
          isReleased: new FormControl(
            this.course.isReleased,
            Validators.required
          ),
        });
      }
    }
  }

  constructor(private cloudService: CloudStorageService) {}

  toggle(toggle: boolean) {
    this.toggleEvent.emit(toggle);
  }

  editLessons() {
    this.editLessonsEvent.emit(false);
  }

  editQuiz() {
    this.editQuizEvent.emit(false);
  }

  createNewCourse() {
    let newCourse: Course = {
      ...this.course,
      ...this.courseForm.value,
      rating: 0,
    };
    console.log(newCourse);
    this.createEvent.emit(newCourse);
  }
  categories = [
    'Frontend Developer',
    'Backend Developer',
    'Mobile Developer',
    'AI',
    'Database',
    'Algorithm',
    'Security',
    'Network',
    'Bussiness',
    'Software',
    'Hardware',
    'OS',
    'Math',
    'Science',
    'Chemistry',
    'Physics',
    'Biology',
    'Psychology',
    'History',
    'Geography',
    'Language',
    'Culture',
    'Social',
    'Literature',
    'Music',
    'Art',
    'Engineering',
    'Architecture',
    'Marketing',
  ];
  languages = [
    'English',
    'Japanese',
    'Vietnamese',
    'Korean',
    'Chinese',
    'Spanish',
    'Russian',
    'German',
    'Italian',
    'French',
    'Brazilian',
  ];

  updateCourse() {
    let newUpdateCourse: Course = {
      ...this.course,
      ...this.courseForm.value,
    };
    // console.log(newUpdateCourse);
    this.updateEvent.emit(newUpdateCourse);
  }
  //upload image func
  async uploadImageToCloud() {
    if (this.control.value != null) {
      let result = await this.cloudService.upLoadCourseImage(
        this.control.value,
        this.course != null ? this.course._id : ''
      );
      if (typeof result === 'object') {
        this.rejectedFiles$.next(this.control.value);
      } else {
        console.log('File available at', result);

        this.courseForm.controls['img'].setValue(result);
      }
    }
  }

  readonly control = new FormControl<File | Blob | null>(
    null,
    Validators.required
  );

  readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  readonly loadedFiles$ = this.control.valueChanges.pipe(
    switchMap((file) => (file ? this.makeRequest(file) : of(null)))
  );

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    this.rejectedFiles$.next(file as TuiFileLike);
  }

  removeFile(): void {
    this.control.setValue(null);
  }

  clearRejected(): void {
    this.removeFile();
    this.rejectedFiles$.next(null);
  }

  makeRequest(file: TuiFileLike): Observable<TuiFileLike | null> {
    this.loadingFiles$.next(file);

    return timer(1000).pipe(
      map(() => {
        if (file != undefined) {
          if (file.size == undefined ? 0 : file.size / Math.pow(1024, 2) <= 5) {
            return file;
          }
        }
        this.rejectedFiles$.next(file);
        return null;
      }),
      finalize(() => this.loadingFiles$.next(null))
    );
  }
}
