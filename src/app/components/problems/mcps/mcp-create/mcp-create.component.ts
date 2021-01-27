import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Mcp } from '../../../../models/problems/mcps.model';
import { McpsService } from '../../../../services/problems/mcps.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mcp-create',
  templateUrl: './mcp-create.component.html',
  styleUrls: ['./mcp-create.component.css']
})
export class McpCreateComponent implements OnInit, OnDestroy {
  mcp: Mcp;
  form: FormGroup;
  answers: Array<string> = [];
  correctAnswer: string;
  isLoading = false;
  private mode = 'create';
  private topicId: string;
  private authStatusSub: Subscription;

  constructor(
    public problemsService: McpsService,
    public route: ActivatedRoute,
    public router: Router,
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
      question: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      answer: new FormControl(null, {
        validators: []
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('mcpId')) {
        this.mode = 'edit';
        this.isLoading = true;
        this.problemsService.getMcpById(paramMap.get('mcpId')).subscribe(mcpData => {
          console.log(mcpData);
          this.mcp = {
            id: mcpData.mcp._id,
            question: mcpData.mcp.question,
            answers: mcpData.mcp.answers,
            correctAnswer: mcpData.mcp.correctAnswer,
            topic: mcpData.mcp.topic,
            creator: mcpData.mcp.creator
          };
          this.topicId = this.mcp.topic;
          this.form.setValue({
            question: this.mcp.question,
            answer: ''
          });
          this.answers = this.mcp.answers;
         });
      } else {
        this.mode = 'create';
        this.topicId = paramMap.get('topicId');
      }
    });
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  onAddAnswer() {
    this.answers.push(this.form.value.answer);
    this.form.setValue({
      question: this.form.value.question,
      answer: ''
    });
  }

  onDeleteAnswer(index: number) {

  }

  onSaveMcp() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.problemsService.addMcp(
        this.form.value.question,
        this.answers,
        this.correctAnswer,
        this.topicId
      );
    } else {
      this.problemsService.updateMcp(
        this.mcp.id,
        this.form.value.question,
        this.answers,
        this.correctAnswer,
        this.topicId
      );
    }
    this.form.reset();
  }

  cancel() {
    this.router.navigate(['/topics/edit/', this.topicId]);
  }
}
