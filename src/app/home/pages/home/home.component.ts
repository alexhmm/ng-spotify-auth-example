import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Token } from 'src/app/shared/models/token.interface';
import { UserProfile } from 'src/app/shared/models/user-profile.interface';

import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  token: Token;
  unsubscribe$: Subject<any> = new Subject();
  userProfile: UserProfile;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(params => {
        if (params && params.code && params.state) {
          // Get spotify token after redirect
          this.authService
            .getToken(params.code, params.state)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
              token => {
                this.token = token;
                this.authService
                  .getUserProfile(token.access_token)
                  .subscribe(userProfile => {
                    this.userProfile = userProfile;
                  });
              },
              error => {
                // Navigate back to login
                this.router.navigate(['auth', 'login']);
              }
            );
        } else {
          // Check token
        }
      });
  }

  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Handler to refresh access token.
   */
  onGetRefreshToken(): void {
    this.authService
      .getTokenByRefresh(this.token.refresh_token)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(token => {
        this.token.access_token = token.access_token;
      });
  }
}
