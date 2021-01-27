import { Component, OnInit, OnDestroy, Input, } from '@angular/core';
import { Subscription } from 'rxjs';

import { Course } from '../../../models/courses.model';
import { CoursesService } from '../../../services/courses.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit, OnDestroy {
  @Input() user: string;
  userIsAuthenticated = false;
  isLoading = false;
  userId: string;
  courses: Course[] = [];
  totalCourses = 10; // dummy value
  coursesPerPage = 2; // dummy value
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private coursesSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public coursesService: CoursesService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoading = true;
    if (this.user === 'none') {
      this.coursesService.getCourses(this.coursesPerPage, this.currentPage);
    } else {
      this.coursesService.getCoursesForUser(this.coursesPerPage, this.currentPage, this.user);
    }
    this.userId = this.authService.getUserId();
    this.coursesSub = this.coursesService.getCourseUpdateListener()
      .subscribe((courseData: {courses: Course[], courseCount: number}) => {
        this.isLoading = false;
        this.courses = courseData.courses;
        this.totalCourses = courseData.courseCount;
      });
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.coursesPerPage = pageData.pageSize;
    if (this.user === 'none') {
      this.coursesService.getCourses(this.coursesPerPage, this.currentPage);
    } else {
      this.coursesService.getCoursesForUser(this.coursesPerPage, this.currentPage, this.user);
    }
  }

  onDelete(classId: string) {
    this.isLoading = true;
    this.coursesService.deleteCourse(classId).subscribe(() => {
      this.coursesService.getCoursesForUser(this.coursesPerPage, this.currentPage, this.userId);
    }, () => {
      this.isLoading = false;
    });
  }


  ngOnDestroy(): void {
    this.coursesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
