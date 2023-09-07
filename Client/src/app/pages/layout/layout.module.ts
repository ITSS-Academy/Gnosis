import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { BrowseComponent } from './components/browse/browse.component';
import { DetailComponent } from './components/browse/components/detail/detail.component';
import { ReviewComponent } from './components/review/review.component';
import { CartComponent } from './components/cart/cart.component';
import { AnalysticComponent } from './components/analystic/analystic.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { AdminComponent } from './components/admin/admin.component';
import { CourseFormComponent } from './components/admin/components/course-form/course-form.component';
import { LessonComponent } from './components/admin/components/lesson/lesson.component';
import { EditorComponent } from './components/admin/components/lesson/components/editor/editor.component';
import { QuillModule } from 'ngx-quill';
import { LessonInfoFormComponent } from './components/admin/components/lesson/components/lesson-info-form/lesson-info-form.component';
import { CourseComponent } from './components/course/course.component';
import { QuizEditorComponent } from './components/admin/components/quiz-editor/quiz-editor.component';
import { QuestionEditorComponent } from './components/admin/components/quiz-editor/components/question-editor/question-editor.component';
import { QuizFormComponent } from './components/admin/components/quiz-editor/components/quiz-form/quiz-form.component';
import { LearningComponent } from './components/learning/learning.component';
import { LessonContentComponent } from './components/learning/components/lesson-content/lesson-content.component';
import { QuizContentComponent } from './components/learning/components/quiz-content/quiz-content.component';


@NgModule({
  declarations: [
    LayoutComponent,
    NavbarComponent,
    SidebarComponent,
    HomeComponent,
    ProfileComponent,
    SettingsComponent,
    QuizComponent,
    BrowseComponent,
    DetailComponent,
    ReviewComponent,
    CartComponent,
    AnalysticComponent,
    AdminComponent,
    CourseFormComponent,
    LessonComponent,
    EditorComponent,
    LessonInfoFormComponent,
    CourseComponent,
    QuizEditorComponent,
    QuestionEditorComponent,
    QuizFormComponent,
    LearningComponent,
    LessonContentComponent,
    QuizContentComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,
    QuillModule.forRoot(),
  ],
})
export class LayoutModule { }
