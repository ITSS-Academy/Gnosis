import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { HomeComponent } from './components/home/home.component';
import { BrowseComponent } from './components/browse/browse.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AnalysticComponent } from './components/analystic/analystic.component';
import { CartComponent } from './components/cart/cart.component';
import { AdminComponent } from './components/admin/admin.component';
import { LessonComponent } from './components/admin/components/lesson/lesson.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { DetailComponent } from './components/browse/components/detail/detail.component';
import { QuizEditorComponent } from './components/admin/components/quiz-editor/quiz-editor.component';
import { CourseComponent } from './components/course/course.component';
import { RoleGuard } from 'src/app/guards/role.guard';
import { LearningComponent } from './components/learning/learning.component';
import { ReviewComponent } from './components/review/review.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'browse',
        component: BrowseComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      // {
      //   path: 'settings',
      //   component: SettingsComponent,
      // },
      {
        path: 'cart',
        component: CartComponent,
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [RoleGuard],
      },
      {
        path: 'admin/course/:id',
        component: LessonComponent,
        canActivate: [RoleGuard],
      },
      {
        path: 'admin/course/:id/quiz',
        component: QuizEditorComponent,
        canActivate: [RoleGuard],
      },
      {
        path: 'home/course/:courseId/quiz/:id',
        component: QuizComponent,
      },
      {
        path: 'browse/detail/:id',
        component: DetailComponent,
      },
      {
        path: 'home/course',
        component: CourseComponent,
      },
      {
        path: 'learning/:id',
        component: LearningComponent,
      },
      {
        path: 'review',
        component: ReviewComponent,
      },
      {
        path: 'home/course/:id',
        component: LearningComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
