import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Sap } from '../../models/problems/saps.model';
import { environment } from '../../../environments/environment';

const URL = environment.apiUrl + '/problems/';

@Injectable({providedIn: 'root'})
export class SapsService {
  constructor(private http: HttpClient, private router: Router) {}

  addSap(inputQuestion: string, inputAnswers: Array<string>, inputCsTopic: string) {
    const sapData = {
      question: inputQuestion,
      answers: inputAnswers,
      topic: inputCsTopic
    };
    this.http
      .post<{message: string, subject: Sap}>(
        URL + '?type=sap',
        sapData
      )
      .subscribe((responseData) => {
        this.router.navigate(['/topics/edit/', sapData.topic]);
      });
  }

  updateSap(inputId: string, inputQuestion: string, inputAnswers: Array<string>, inputCsTopic: string) {
    const sapData = {
      id: inputId,
      question: inputQuestion,
      answers: inputAnswers,
      topic: inputCsTopic,
      creator: null
    };
    this.http
      .put(URL + inputId, sapData)
      .subscribe(response => {
        this.router.navigate(['/topics/edit/', sapData.topic]);
      });
  }

  getSaps(topicId: string) {
    return this.http.get<{
      message: string,
      saps: [{
        _id: string,
        question: string,
        answers: Array<string>,
        topic: string,
        creator: string
      }]
    }>(URL + 'topic/' + topicId + '?type=sap');
  }

  getSapById(id: string) {
    return this.http.get<{
      message: string,
      sap: {
        _id: string,
        question: string,
        answers: Array<string>,
        topic: string,
        creator: string
      }
    }>(URL + id + '?type=sap');
  }

  deleteSap(sap: string) {
    return this.http
      .delete(URL + sap);
  }

}
