import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { TopicsService } from '../../../services/topics.service';
import { Topic } from '../../../models/topics.model';
import { SapsService } from '../../../services/problems/saps.service';
import { Sap } from '../../../models/problems/saps.model';

@Component({
  selector: 'app-topic-create',
  templateUrl: './topic-create.component.html',
  styleUrls: ['./topic-create.component.css']
})
export class TopicCreateComponent implements OnInit, OnDestroy {
  topic: Topic;
  saps: Sap[] = [];
  imagePreview: string;
  form: FormGroup;
  isLoading = false;
  hasProblems = false;
  private mode = 'create';
  private subjectId: string;
  private topicId: string;
  private authStatusSub: Subscription;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private authService: AuthService,
    private topicsService: TopicsService,
    private problemsService: SapsService
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
      lecture: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('topicId')) {
        this.mode = 'edit';
        this.topicId = paramMap.get('topicId');
        this.isLoading = true;
        this.topicsService.getTopic(this.topicId).subscribe(topicData => {
          this.topic = {
            id: topicData.topic._id,
            title: topicData.topic.title,
            lecture: topicData.topic.lecture,
            course: topicData.topic.course,
            creator: topicData.topic.creator
          };
          this.problemsService.getSaps(this.topicId).subscribe(sapData => {
            if (sapData.saps) {
              this.hasProblems = true;
              for (const sap of sapData.saps) {
                this.saps.push({
                  id: sap._id,
                  question: sap.question,
                  answers: sap.answers,
                  topic: sap.topic,
                  creator: sap.creator
                });
              }
            }
          });
          this.form.setValue({
            title: this.topic.title,
            lecture: this.topic.lecture
          });
          this.subjectId = this.topic.course;
          this.isLoading = false;
         });
      } else {
        this.subjectId = paramMap.get('subjectId');
        this.mode = 'create';
        this.topicId = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  onSaveTopic() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.topicsService.addTopic(
        this.form.value.title,
        this.form.value.lecture,
        this.subjectId
      );
    } else {
      this.topicsService.updateTopic(
        this.topic.id,
        this.form.value.title,
        this.form.value.lecture,
        this.subjectId
      );
    }
    this.form.reset();
  }

  onAddProblem() {
    if (!this.topicId) {
      alert('Save topic before adding problems');
    } else {
      this.router.navigate(['/sap/create', this.topicId]);
    }
  }

  editSap(sapId: string) {
    this.router.navigate(['/sap/edit', sapId]);
  }

  deleteSap(sapId: string) {
    this.problemsService.deleteSap(sapId);
  }
}
