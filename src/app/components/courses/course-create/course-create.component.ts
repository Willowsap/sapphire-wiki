import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { CoursesService } from '../../../services/courses.service';
import { Course } from '../../../models/courses.model';
import { mimeType } from '../../../mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-course-create',
  templateUrl: './course-create.component.html',
  styleUrls: ['./course-create.component.css']
})
export class CreateCoursesComponent implements OnInit, OnDestroy {
  course: Course;
  imagePreview: string;
  form: FormGroup;
  isLoading = false;
  private mode = 'create';
  private id: string;
  private authStatusSub: Subscription;

  constructor(
    public coursesService: CoursesService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(
        authStatus => {
          this.isLoading = false;
        }
      );
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.id = paramMap.get('id');
        this.isLoading = true;
        this.coursesService.getCourse(this.id).subscribe(courseData => {
          this.isLoading = false;
          this.imagePreview = courseData.course.imagePath;
          this.course = {
            id: courseData.course._id,
            title: courseData.course.title,
            content: courseData.course.content,
            imagePath: courseData.course.imagePath,
            creator: courseData.course.creator
          };
          this.form.setValue({
            title: this.course.title,
            content: this.course.content,
            image: this.course.imagePath
          });
         });
      } else {
        this.mode = 'create';
        this.id = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveCourse() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.coursesService.addCourse(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.coursesService.updateCourse(
        this.course.id,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }
}
