import { Component, Input } from '@angular/core';
import { Topic } from '../../models/topics.model';
import { TopicsService } from '../../services/topics.service';

@Component({
  selector: 'app-topic-button',
  templateUrl: './topic-button.component.html',
  styleUrls: ['./topic-button.component.css']
})
export class TopicButtonComponent {
  @Input() topic: Topic;
  @Input() onDelete: (id: string) => void;
  @Input() userIsAuthenticated: boolean;
  @Input() userId: string;
  isLoading: boolean;

  constructor(public topicsService: TopicsService) {}
}
