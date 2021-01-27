import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  isLoading = false;
  userId: string;
  editing = 'none';
  private authStatusSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
