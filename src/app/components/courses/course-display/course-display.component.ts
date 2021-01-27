import { Component, OnInit, OnDestroy, Input, } from '@angular/core';
import { CoursesService } from '../../../services/courses.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Course } from '../../../models/courses.model';
import { Topic } from '../../../models/topics.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { TopicsService } from '../../../services/topics.service';

@Component({
  selector: 'app-course-display',
  templateUrl: './course-display.component.html',
  styleUrls: ['./course-display.component.css']
})
export class CourseDisplayComponent implements OnInit, OnDestroy {
  @Input() edit: boolean;
  id: string;
  isLoading = false;
  course: Course;
  topics: Topic[];
  userIsAuthenticated = false;
  userId: string;
  private authStatusSub: Subscription;

  constructor(
    public coursesService: CoursesService,
    public topicsService: TopicsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = paramMap.get('id');
      this.userId = this.authService.getUserId();
      this.isLoading = true;
      this.coursesService.getCourse(this.id).subscribe(courseData => {
        this.course = {
          id: courseData.course._id,
          title: courseData.course.title,
          content: courseData.course.content,
          imagePath: courseData.course.imagePath,
          creator: courseData.course.creator
        };
        this.topicsService.getTopics(this.id).subscribe(topicData => {
          this.topics = new Array<Topic>();
          for (const topic of topicData.topics) {
            this.topics.push({
              id: topic._id,
              title: topic.title,
              lecture: topic.lecture,
              course: topic.course,
              creator: topic.creator
            });
          }
          this.isLoading = false;
        });
      });
    });
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.topics = [];
    this.topicsService.deleteTopic(id).subscribe(() => {
      this.topicsService.getTopics(this.id).subscribe(topicData => {
        this.topics = new Array<Topic>();
        for (const topic of topicData.topics) {
          this.topics.push({
            id: topic._id,
            title: topic.title,
            lecture: topic.lecture,
            course: topic.course,
            creator: topic.creator
          });
        }
        this.isLoading = false;
      });
    });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
