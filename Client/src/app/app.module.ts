import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import {
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TUI_SANITIZER,
} from '@taiga-ui/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { SharedModule } from './shared/shared/shared.module';
import { authReducer } from './ngrx/reducers/auth.reducer';
import { userReducer } from './ngrx/reducers/user.reducer';
import { LoadingComponent } from './pages/loading/loading.component';
import { AuthEffects } from './ngrx/effects/auth.effects';
import { profileReducer } from './ngrx/reducers/profile.reducer';
import { UserEffects } from './ngrx/effects/user.effects';
import { ProfileEffects } from './ngrx/effects/profile.effects';
import { HttpClientModule } from '@angular/common/http';
import { courseReducer } from './ngrx/reducers/course.reducer';
import { CartReducer } from './ngrx/reducers/cart.reducer';
import { CourseEffects } from './ngrx/effects/course.effects';
import { quizReducer } from './ngrx/reducers/quiz.reducer';
import { QuizEffects } from './ngrx/effects/quiz.effects';
import { lessonReducer } from './ngrx/reducers/lesson.reducer';
import { LessonEffects } from './ngrx/effects/lesson.effects';
import { questionReducer } from './ngrx/reducers/question.reducer';
import { QuestionEffects } from './ngrx/effects/question.effects';
import { ReviewReducer } from './ngrx/reducers/review.reducer';
import { ReviewEffect } from './ngrx/effects/review.effects';
import { quizBankReducer } from './ngrx/reducers/quizBank.reducer';
import { QuizBankEffects } from './ngrx/effects/quizBank.effects';
@NgModule({
  declarations: [AppComponent, LoadingComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(
      {
        auth: authReducer,
        user: userReducer,
        profile: profileReducer,
        course: courseReducer,
        cart: CartReducer,
        lesson: lessonReducer,
        quiz: quizReducer,
        question: questionReducer,
        review: ReviewReducer,
        quizBank: quizBankReducer,
      },
      {}
    ),
    EffectsModule.forRoot([
      AuthEffects,
      UserEffects,
      ProfileEffects,
      CourseEffects,
      QuizEffects,
      QuestionEffects,
      ReviewEffect,
      QuizBankEffects,
      LessonEffects,
    ]),
    BrowserAnimationsModule,
    HttpClientModule,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    SharedModule,
  ],
  providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }],
  bootstrap: [AppComponent],
})
export class AppModule { }
