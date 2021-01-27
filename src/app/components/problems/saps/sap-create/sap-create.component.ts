import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Sap } from '../../../../models/problems/saps.model';
import { SapsService } from '../../../../services/problems/saps.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sap-create',
  templateUrl: './sap-create.component.html',
  styleUrls: ['./sap-create.component.css']
})
export class SapCreateComponent implements OnInit, OnDestroy {
  sap: Sap;
  form: FormGroup;
  answers: Array<string> = [];
  isLoading = false;
  private mode = 'create';
  private topicId: string;
  private authStatusSub: Subscription;

  constructor(
    public problemsService: SapsService,
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
      if (paramMap.has('sapId')) {
        this.mode = 'edit';
        this.isLoading = true;
        this.problemsService.getSapById(paramMap.get('sapId')).subscribe(sapData => {
          console.log(sapData);
          this.sap = {
            id: sapData.sap._id,
            question: sapData.sap.question,
            answers: sapData.sap.answers,
            topic: sapData.sap.topic,
            creator: sapData.sap.creator
          };
          this.topicId = this.sap.topic;
          this.form.setValue({
            question: this.sap.question,
            answer: ''
          });
          this.answers = this.sap.answers;
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

  onSaveSap() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.problemsService.addSap(
        this.form.value.question,
        this.answers,
        this.topicId
      );
    } else {
      this.problemsService.updateSap(
        this.sap.id,
        this.form.value.question,
        this.answers,
        this.topicId
      );
    }
    this.form.reset();
  }

  cancel() {
    this.router.navigate(['/topics/edit/', this.topicId]);
  }
}
