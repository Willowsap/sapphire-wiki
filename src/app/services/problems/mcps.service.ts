import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Mcp } from '../../models/problems/mcps.model';
import { environment } from '../../../environments/environment';

const URL = environment.apiUrl + '/problems/';

@Injectable({providedIn: 'root'})
export class McpsService {
  constructor(private http: HttpClient, private router: Router) {}

  addMcp(inputQuestion: string, inputAnswers: Array<string>, inputCorrectAnswer: string, inputCsTopic: string) {
    const mcpData = {
      question: inputQuestion,
      answers: inputAnswers,
      correctAnswer: inputCorrectAnswer,
      topic: inputCsTopic
    };
    this.http
      .post<{message: string, subject: Mcp}>(
        URL + '?type=mcp',
        mcpData
      )
      .subscribe((responseData) => {
        this.router.navigate(['/topics/edit/', mcpData.topic]);
      });
  }

  updateMcp(inputId: string, inputQuestion: string, inputAnswers: Array<string>,  inputCorrectAnswer: string, inputCsTopic: string) {
    const mcpData = {
      id: inputId,
      question: inputQuestion,
      answers: inputAnswers,
      correctAnswer: inputCorrectAnswer,
      topic: inputCsTopic,
      creator: null
    };
    this.http
      .put(URL + inputId, mcpData)
      .subscribe(response => {
        this.router.navigate(['/topics/edit/', mcpData.topic]);
      });
  }

  getMcps(topicId: string) {
    return this.http.get<{
      message: string,
      mcps: [{
        _id: string,
        question: string,
        answers: Array<string>,
        correctAnswer: string,
        topic: string,
        creator: string
      }]
    }>(URL + 'topic/' + topicId + '?type=mcp');
  }

  getMcpById(id: string) {
    return this.http.get<{
      message: string,
      mcp: {
        _id: string,
        question: string,
        answers: Array<string>,
        correctAnswer: string,
        topic: string,
        creator: string
      }
    }>(URL + id + '?type=mcp');
  }

  deleteMcp(mcp: string) {
    return this.http
      .delete(URL + mcp);
  }

}
