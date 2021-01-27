import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { Topic } from '../models/topics.model';
import { environment } from '../../environments/environment';

const URL = environment.apiUrl + '/topics/';

@Injectable({providedIn: 'root'})
export class TopicsService {
  private topics: Topic[] = [];
  private topicsUpdated = new Subject<{topics: Topic[]}>();

  constructor(private http: HttpClient, private router: Router) {}

  getTopics(id: string) {
    return this.http
      .get<{message: string, topics: any, maxTopics: number}>(
        URL + id + '?courseId=true'
      );
  }

  getTopicUpdateListener() {
    return this.topicsUpdated.asObservable();
  }

  getTopic(id: string) {
    return this.http.get<{
      message: string,
      topic: {
        _id: string,
        title: string,
        lecture: string,
        course: string,
        creator: string
      }
    }>(URL + id);
  }

  addTopic(inputTitle: string, inputLecture: string, inputCourse: string) {
    const topicData = {
      title: inputTitle,
      lecture: inputLecture,
      course: inputCourse
    };
    this.http
      .post<{message: string, course: Topic}>(
        URL,
        topicData
      )
      .subscribe((responseData) => {
        this.router.navigate(['/course', topicData.course]);
      });
  }

  updateTopic(inputId: string, inputTitle: string, inputLecture: string, inputCourse: string) {
    const topicData = {
      id: inputId,
      title: inputTitle,
      lecture: inputLecture,
      course: inputCourse,
      creator: null
    };
    this.http
      .put(URL + inputId, topicData)
      .subscribe(response => {
        this.router.navigate(['/course', topicData.course]);
      });
  }

  deleteTopic(topicId: string) {
    return this.http
      .delete(URL + topicId);
  }
}
