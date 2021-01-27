import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

const URL = environment.apiUrl + '/users/';

@Injectable({ providedIn: 'root'})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken(): string {
    return this.token;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getUserId(): string {
    return this.userId;
  }

  createUser(inputEmail: string, inputPassword: string) {
    const authData: AuthData = {email: inputEmail, password: inputPassword};
    this.http
      .post(URL + 'signup', authData)
      .subscribe(() => {
        this.router.navigate(['/auth/login']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  login(inputEmail: string, inputPassword: string) {
    const authData: AuthData = {email: inputEmail, password: inputPassword};
    this.http.post<{token: string, expiresIn: number, userId: string}>(URL + 'login', authData)
      .subscribe(result => {
        const token = result.token;
        this.token = token;
        if (token) {
          const expiresInDuration = result.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = result.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, result.userId);
          this.router.navigate(['/account']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);

  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const storedToken = localStorage.getItem('token');
    const storedExpirationDate = localStorage.getItem('expiration');
    const storedUserId = localStorage.getItem('userId');
    if (!storedToken || !storedExpirationDate) {
      return;
    }
    return {
      token: storedToken,
      expirationDate: new Date(storedExpirationDate),
      userId: storedUserId
    };
  }
}
