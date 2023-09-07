import { Component, Input, OnInit } from '@angular/core';
import Quill from 'quill';
import 'quill-emoji/dist/quill-emoji.js';
import ImageResize from 'quill-image-resize-module';
import { ImageDrop } from 'quill-image-drop-module';
import { ImageHandler, Options } from 'ngx-quill-upload';
Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/imageDrop', ImageDrop);
Quill.register('modules/imageHandler', ImageHandler);

@Component({
  selector: 'app-lesson-content',
  templateUrl: './lesson-content.component.html',
  styleUrls: ['./lesson-content.component.less'],
})
export class LessonContentComponent implements OnInit {
  content: any;
  @Input('content')
  set contentInput(contentVal: string | undefined) {
    if (contentVal == undefined) return;
    console.log('raw', JSON.parse(contentVal));
    this.content = JSON.parse(contentVal);
  }
  ngOnInit(): void {}
  constructor() {}
}
