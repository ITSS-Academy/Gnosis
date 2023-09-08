import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  TuiAlertService,
  TuiDialogService,
  TuiDialogContext,
} from '@taiga-ui/core';
import { Question } from 'src/app/models/question.model';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'app-question-editor',
  templateUrl: './question-editor.component.html',
  styleUrls: ['./question-editor.component.less'],
})
export class QuestionEditorComponent implements OnInit {
  checkBoxList: Array<FormControl> = [];
  optionList: Array<FormControl> = [];
  quizBankForm: FormGroup = new FormGroup({
    _id: new FormControl({ value: '', disabled: true }, Validators.required),
    img: new FormControl('', Validators.required),
    question: new FormControl(''),
  });
  quest!: Question;
  @Input('question')
  set questInput(value: Question | null) {
    if (value != null) {
      //binding val
      this.quest = value;
      this.checkBoxList = [];
      this.optionList = [];
      this.quest.quizBank.options.forEach((opt) => {
        if (this.quest!.quizBank.answerList.includes(opt)) {
          this.checkBoxList.push(new FormControl(true));
        } else {
          this.checkBoxList.push(new FormControl(false));
        }
        this.optionList.push(new FormControl(opt, Validators.required));
      });
      this.quizBankForm = new FormGroup({
        _id: new FormControl(
          { value: this.quest?.quizBank._id, disabled: true },
          Validators.required
        ),
        img: new FormControl(this.quest.quizBank.img),
        question: new FormControl(
          this.quest.quizBank.question,
          Validators.required
        ),
      });
    } else {
      this.quest = <Question>{};
    }
  }

  @Output('save') saveEvent: EventEmitter<Question> = new EventEmitter();
  @Input('isPreview') isPreview!: boolean;
  @Input('isSave')
  set isSaveInput(isSave: boolean) {
    if (isSave) {
      let isValid = true;
      let ansCount = 0;
      if (this.quizBankForm.invalid) {
        this.dangerNotification(`Please correct this question form !!!`);
        isValid = false;
      }
      this.checkBoxList.forEach((val) => {
        if (val.value) {
          ansCount++;
        }
      });
      if (ansCount == 0) {
        this.dangerNotification(
          `Please set at least 1 answer for this question !!!`
        );
        isValid = false;
      }
      if (this.optionList.length <= 1) {
        this.dangerNotification(
          `Please have more than 1 option for this question !!!`
        );
        isValid = false;
      }
      this.optionList.forEach((val, i) => {
        if (val.invalid) {
          this.dangerNotification(`Please fill this option ${i} content !!!`);
          isValid = false;
        }
      });
      if (isValid == false) {
        return;
      } else {
        if (this.quest != undefined) {
          let optList: string[] = [];
          let ansList: string[] = [];
          this.optionList.forEach((val, i) => {
            optList.push(val.value);
            if (this.checkBoxList[i].value) {
              ansList.push(val.value);
            }
          });
          let newQuestion: Question = {
            ...this.quest,
            quizBank: {
              ...this.quizBankForm.value,
              _id: this.quest.quizBank._id,
              options: optList,
              answerList: ansList,
            },
          };
          this.saveEvent.emit(newQuestion);
        }
      }
    }
  }

  ngOnInit(): void {}
  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    @Inject(TuiDialogService)
    private readonly dialogs: TuiDialogService
  ) {}

  //noti func
  dangerNotification(message: string): void {
    this.alerts
      .open('', {
        label: message,
        status: 'error',
        autoClose: 3500,
      })
      .subscribe();
  }

  //add func
  addNewOption() {
    this.optionList.push(new FormControl('', Validators.required));
    this.checkBoxList.push(new FormControl(false));
  }

  //del func
  deleteOption(index: number) {
    this.optionList = this.optionList.filter((val, i) => i != index);
    this.checkBoxList = this.checkBoxList.filter((val, i) => i != index);
  }

  showWarningDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogs.open(content).subscribe();
  }
}
