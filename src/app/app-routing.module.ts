import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { AccountComponent } from './pages/account/account.component';
import { CreateCoursesComponent } from './components/courses/course-create/course-create.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { AuthGuard } from './auth/auth.guard';
import { CourseDisplayComponent } from './components/courses/course-display/course-display.component';
import { TopicCreateComponent } from './pages/topics/topic-create/topic-create.component';
import { TopicDisplayComponent } from './pages/topics/topic-display/topic-display.component';
import { SapCreateComponent } from './components/problems/saps/sap-create/sap-create.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'courses', component: CoursesComponent },
    { path: 'courses/edit/:id', component: CreateCoursesComponent, canActivate: [AuthGuard] },
    { path: 'courses/create', component: CreateCoursesComponent, canActivate: [AuthGuard] },
    { path: 'course/:id', component: CourseDisplayComponent },
    { path: 'topics/:id', component: TopicDisplayComponent },
    { path: 'topics/create/:subjectId', component: TopicCreateComponent, canActivate: [AuthGuard] },
    { path: 'topics/edit/:topicId', component: TopicCreateComponent, canActivate: [AuthGuard] },
    { path: 'sap/create/:topicId', component: SapCreateComponent, canActivate: [AuthGuard] },
    { path: 'sap/edit/:sapId', component: SapCreateComponent, canActivate: [AuthGuard] },
    { path: 'about', component: AboutComponent },
    { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {}
