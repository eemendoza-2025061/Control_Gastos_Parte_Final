import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthResponse, User } from '../models/user.model';
import { Observable, catchError, tap, throwError, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private logoutTimer: ReturnType<typeof setTimeout> | null = null;

  public currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.checkTokenAndLoadUser();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.success && response.token && response.user) {
            localStorage.setItem('token', response.token);
            this.currentUserSubject.next(response.user);
            this.scheduleLogout(response.token);
          }
        }),
        catchError(this.handleError)
      );
  }

  loginWithGoogle(credential: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/google`, { credential })
      .pipe(
        tap(response => {
          if (response.success && response.token && response.user) {
            localStorage.setItem('token', response.token);
            this.currentUserSubject.next(response.user);
            this.scheduleLogout(response.token);
          }
        }),
        catchError(this.handleError)
      );
  }

  updateSavingsGoal(amount: number): Observable<{ success: boolean; user: User }> {
    return this.http.put<{ success: boolean; user: User }>(`${environment.apiUrl}/auth/savings-goal`, { amount })
      .pipe(
        tap(response => this.currentUserSubject.next(response.user)),
        catchError(this.handleError)
      );
  }

  logout(reason?: string): void {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login'], { state: { sessionMessage: reason } });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    return this.currentUserSubject.value?.role || null;
  }

  private checkTokenAndLoadUser(): void {
    const token = this.getToken();
    if (token) {
      this.scheduleLogout(token);
      this.http.get<{success: boolean, user: User}>(`${environment.apiUrl}/auth/me`)
        .subscribe({
          next: (res) => this.currentUserSubject.next(res.user),
          error: () => {
            if (this.getToken() === token) {
              this.logout('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
            }
          }
        });
    }
  }

  private scheduleLogout(token: string): void {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
    const exp = this.getTokenExpiration(token);
    if (!exp) {
      return;
    }
    const now = Math.floor(Date.now() / 1000);
    const delay = (exp - now) * 1000;
    if (delay <= 0) {
      this.logout();
      return;
    }
    this.logoutTimer = setTimeout(() => this.logout('Su sesión ha expirado. Por favor, inicie sesión nuevamente.'), delay);
  }

  private getTokenExpiration(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp || null;
    } catch {
      return null;
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Código de error: ${error.status}`;
    }
    return throwError(() => new Error(errorMessage));
  }
  
}
