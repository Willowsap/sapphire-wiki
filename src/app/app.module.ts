import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AngularMaterialModule } from './angular-material.module';
import { AppRoutingModule } from './app-routing.module';

import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { AccountComponent } from './pages/account/account.component';
import { CoursesComponent } from './pages/courses/courses.component';

import { HeaderComponent } from './components/header/header.component';
import { ErrorComponent } from './components/error/error.component';
import { CourseListComponent } from './components/courses/course-list/course-list.component';
import { CreateCoursesComponent } from './components/courses/course-create/course-create.component';
import { CourseDisplayComponent } from './components/courses/course-display/course-display.component';
import { TopicCreateComponent } from './pages/topics/topic-create/topic-create.component';
import { TopicDisplayComponent } from './pages/topics/topic-display/topic-display.component';
import { TopicButtonComponent } from './components/topic-button/topic-button.component';
import { SapDisplayComponent } from './components/problems/saps/sap-display/sap-display.component';
import { SapCreateComponent } from './components/problems/saps/sap-create/sap-create.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    AboutComponent,
    AccountComponent,
    ErrorComponent,
    CoursesComponent,
    CourseListComponent,
    CreateCoursesComponent,
    CourseDisplayComponent,
    TopicCreateComponent,
    TopicDisplayComponent,
    SapDisplayComponent,
    SapCreateComponent,
    TopicButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    RouterModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
