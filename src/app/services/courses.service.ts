import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Course } from '../models/courses.model';
import { environment } from '../../environments/environment';

const URL = environment.apiUrl + '/courses/';

@Injectable({providedIn: 'root'})
export class CoursesService {
  private courses: Course[] = [];
  private coursesUpdated = new Subject<{courses: Course[], courseCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getCourses(coursesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${coursesPerPage}&page=${currentPage}`;
    this.http
      .get<{message: string, courses: any, maxCourses: number}>(
        URL + queryParams
      )
      .pipe(
        map(courseData => {
        return { courses: courseData.courses.map(c => {
          return {
            title: c.title,
            content: c.content,
            id: c._id,
            imagePath: c.imagePath,
            creator: c.creator
          };
        }), maxCourses: courseData.maxCourses};
      }))
      .subscribe(transformedCourseData => {
        this.courses = transformedCourseData.courses;
        this.coursesUpdated.next({
          courses: [...this.courses],
          courseCount: transformedCourseData.maxCourses
        });
      });
  }

  getCoursesForUser(coursesPerPage: number, currentPage: number, userId: string) {
    const queryParams = `?pagesize=${coursesPerPage}&page=${currentPage}&userId=${userId}`;
    this.http
      .get<{message: string, courses: any, maxCourses: number}>(
        URL + queryParams
      )
      .pipe(
        map(courseData => {
        return { courses: courseData.courses.map(c => {
          return {
            title: c.title,
            content: c.content,
            id: c._id,
            imagePath: c.imagePath,
            creator: c.creator
          };
        }), maxCourses: courseData.maxCourses};
      }))
      .subscribe(transformedCourseData => {
        this.courses = transformedCourseData.courses;
        this.coursesUpdated.next({
          courses: [...this.courses],
          courseCount: transformedCourseData.maxCourses
        });
      });
  }
  getCourseUpdateListener() {
    return this.coursesUpdated.asObservable();
  }

  getCourse(id: string) {
    return this.http.get<{
      message: string,
      course: {
        _id: string,
        title: string,
        content: string,
        imagePath: string,
        creator: string
      }
    }>(URL + id);
  }

  addCourse(inputTitle: string, inputContent: string, inputImage: File) {
    const courseData = new FormData();
    courseData.append('title', inputTitle);
    courseData.append('content', inputContent);
    courseData.append('image', inputImage, inputTitle);
    this.http
      .post<{message: string, course: Course}>(
        URL,
        courseData
      )
      .subscribe((responseData) => {
        this.router.navigate(['/account']);
      });
  }

  updateCourse(inputId: string, inputTitle: string, inputContent: string, inputImage: File | string) {
    let courseData: FormData | Course;
    if (typeof(inputImage) === 'object') {
      courseData = new FormData();
      courseData.append('id', inputId);
      courseData.append('title', inputTitle);
      courseData.append('content', inputContent);
      courseData.append('image', inputImage, inputTitle);
    } else {
      courseData = {
        id: inputId,
        title: inputTitle,
        content: inputContent,
        imagePath: inputImage,
        creator: null
      };
    }
    this.http
      .put(URL + inputId, courseData)
      .subscribe(response => {
        this.router.navigate(['/account']);
      });
  }

  deleteCourse(courseId: string) {
    return this.http
      .delete(URL + courseId);
  }
}
