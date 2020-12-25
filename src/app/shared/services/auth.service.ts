import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as querystring from 'querystring';

import { environment } from 'src/environments/environment';

import { Token } from '../models/token.interface';
import { UserProfile } from '../models/user-profile.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  clientId = environment.clientId;
  clientSecret = environment.clientSecret;
  scope = environment.scope;
  redirectUri = environment.redirectUri;

  constructor(private http: HttpClient) {}

  /**
   * Authorize through spotify
   */
  authorize(): void {
    // Generate random string
    const state = this.generateRandomString(16);

    // Set spotify auth state
    // This provides protection against attacks such as cross-site request forgery
    localStorage.setItem('spotify:auth:state', state);

    // Navigate to spotify authorization page
    window.location.replace(
      'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
          response_type: 'code',
          client_id: this.clientId,
          scope: this.scope,
          redirect_uri: this.redirectUri,
          state
        })
    );
  }

  /**
   * Returns set auth state.
   */
  getAuthState(): string {
    return localStorage.getItem('spotify:auth:state');
  }

  /**
   * Returns spotify access token.
   * @param code Spotify Code
   * @param state Spotify auth state
   */
  getToken(code: string, state: string): Observable<Token> {
    const url = 'https://accounts.spotify.com/api/token';

    // Check auth state
    if (state !== this.getAuthState()) {
      return throwError('Wrong state.');
    }

    // Remove auth state
    localStorage.removeItem('spotify:auth:state');

    // application/x-www-form-urlencoded
    const body =
      'code=' +
      code +
      '&grant_type=authorization_code&redirect_uri=' +
      this.redirectUri;

    const headers = new HttpHeaders({
      // Creates a Base64-encoded ASCII string
      // tslint:disable-next-line:object-literal-key-quotes
      'Authorization':
        'Basic ' + window.btoa(this.clientId + ':' + this.clientSecret),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http
      .post<Token>(url, body, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Returns new access token.
   * @param refreshToken Spotify refresh token
   */
  getTokenByRefresh(refreshToken: string): Observable<Token> {
    const url = 'https://accounts.spotify.com/api/token';

    const body = 'grant_type=refresh_token' + '&refresh_token=' + refreshToken;

    const headers = new HttpHeaders({
      // Creates a Base64-encoded ASCII string
      // tslint:disable-next-line:object-literal-key-quotes
      'Authorization':
        'Basic ' + window.btoa(this.clientId + ':' + this.clientSecret),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http
      .post<Token>(url, body, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Returns current logged in user profile
   * @param token Spotify access token
   */
  getUserProfile(token: string): Observable<UserProfile> {
    const url = 'https://api.spotify.com/v1/me';
    const headers = new HttpHeaders({
      // Creates a Base64-encoded ASCII string
      // tslint:disable-next-line:object-literal-key-quotes
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });
    return this.http
      .get<UserProfile>(url, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   *  Generates a random string containing numbers and letters
   * @param length String length
   */
  generateRandomString(length: number) {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  /**
   * Handles http errors
   * @param error HttpError
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError(error);
  }
}
