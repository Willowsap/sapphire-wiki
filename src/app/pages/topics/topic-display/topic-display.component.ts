import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { TopicsService } from '../../../services/topics.service';
import { Topic } from '../../../models/topics.model';
import { SapsService } from '../../../services/problems/saps.service';

@Component({
  selector: 'app-topic-display',
  templateUrl: 'topic-display.component.html',
  styleUrls: ['./topic-display.component.css']
})
export class TopicDisplayComponent implements OnInit {
  topic: Topic;
  isLoading = false;
  correct = false;
  submitted = false;

  constructor(
    public topicsService: TopicsService,
    public problemsService: SapsService,
    public route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.topicsService.getTopic(paramMap.get('id')).subscribe(csTopicData => {
        this.isLoading = false;
        this.topic = {
          id: csTopicData.topic._id,
          title: csTopicData.topic.title,
          lecture: csTopicData.topic.lecture,
          course: csTopicData.topic.course,
          creator: csTopicData.topic.creator
        };
      });
    });
  }
}
