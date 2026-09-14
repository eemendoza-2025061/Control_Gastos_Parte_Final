import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ManagedUser, ManagedUserPayload } from '../models/managed-user.model';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  getUsers(): Observable<ApiResponse<ManagedUser[]>> {
    return this.http.get<ApiResponse<ManagedUser[]>>(`${environment.apiUrl}/users`).pipe(catchError(this.handleError));
  }

  createUser(payload: ManagedUserPayload): Observable<ApiResponse<ManagedUser>> {
    return this.http.post<ApiResponse<ManagedUser>>(`${environment.apiUrl}/users`, payload).pipe(catchError(this.handleError));
  }

  updateUser(id: string, payload: ManagedUserPayload): Observable<ApiResponse<ManagedUser>> {
    return this.http.put<ApiResponse<ManagedUser>>(`${environment.apiUrl}/users/${id}`, payload).pipe(catchError(this.handleError));
  }

  deleteUser(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${environment.apiUrl}/users/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.error?.message || `Error (${error.status})`));
  }
}
