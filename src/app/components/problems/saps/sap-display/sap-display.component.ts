import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Sap } from '../../../../models/problems/saps.model';
import { SapsService } from '../../../../services/problems/saps.service';

@Component({
  selector: 'app-sap-display',
  templateUrl: './sap-display.component.html',
  styleUrls: ['./sap-display.component.css']
})
export class SapDisplayComponent implements OnInit {
  @Input() topicId: string;
  saps: Sap[] = [];
  isLoading = false;
  question: FormGroup;
  correct = false;
  submitted = false;
  hasProblems = false;
  currProblem = 0;

  constructor(
    public problemsService: SapsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.problemsService.getSaps(this.topicId).subscribe(sapData => {
      if (sapData.saps.length > 0) {
        this.hasProblems = true;
        this.question = new FormGroup({
          answer: new FormControl(null, {
            validators: [
              Validators.required
            ]
          })
        });
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
    if (this.currProblem < this.saps.length - 1) {
      this.currProblem++;
    } else {
      this.hasProblems = false;
    }
    this.question.reset();
    this.question.get('answer').markAsPristine();
  }

  isPossibleAnswer(answer: string) {
    return (this.saps[this.currProblem].answers.indexOf(answer) > -1);
  }
}
