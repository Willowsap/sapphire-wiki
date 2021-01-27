import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Mcp } from '../../../../models/problems/mcps.model';
import { McpsService } from '../../../../services/problems/mcps.service';

@Component({
  selector: 'app-mcp-display',
  templateUrl: './mcp-display.component.html',
  styleUrls: ['./mcp-display.component.css']
})
export class McpDisplayComponent implements OnInit {
  @Input() topicId: string;
  mcps: Mcp[] = [];
  isLoading = false;
  question: FormGroup;
  correct = false;
  submitted = false;
  hasProblems = false;
  currProblem = 0;

  constructor(
    public problemsService: McpsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.problemsService.getMcps(this.topicId).subscribe(mcpData => {
      if (mcpData.mcps.length > 0) {
        this.hasProblems = true;
        this.question = new FormGroup({
          answer: new FormControl(null, {
            validators: [
              Validators.required
            ]
          })
        });
        for (const mcp of mcpData.mcps) {
          this.mcps.push({
            id: mcp._id,
            question: mcp.question,
            answers: mcp.answers,
            correctAnswer: mcp.correctAnswer,
            topic: mcp.topic,
            creator: mcp.creator
          });
        }
      }
      this.isLoading = false;
    });
  }

  onCheckAnswer() {
    if (!this.question.invalid) {
      this.correct = this.isPossibleAnswer(this.question.value.answer) ? true : false;
      this.submitted = true;
    }
  }

  nextProblem() {
    this.correct = false;
    this.submitted = false;
    if (this.currProblem < this.mcps.length - 1) {
      this.currProblem++;
    } else {
      this.hasProblems = false;
    }
    this.question.reset();
    this.question.get('answer').markAsPristine();
  }

  isPossibleAnswer(answer: string) {
    return (this.mcps[this.currProblem].answers.indexOf(answer) > -1);
  }
}
