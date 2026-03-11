import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, RegisterRequest, JwtResponse, MessageResponse } from '../models/job-application.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private currentUser = new BehaviorSubject<string>(this.getStoredUser());

  isLoggedIn$ = this.loggedIn.asObservable();
  currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  private getStoredUser(): string {
    return localStorage.getItem('user_fullname') || '';
  }

  login(request: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        localStorage.setItem('jwt_token', response.token);
        localStorage.setItem('user_fullname', response.fullName);
        localStorage.setItem('username', response.username);
        this.loggedIn.next(true);
        this.currentUser.next(response.fullName);
      })
    );
  }

  register(request: RegisterRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/register`, request);
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_fullname');
    localStorage.removeItem('username');
    this.loggedIn.next(false);
    this.currentUser.next('');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }
}
