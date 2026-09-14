import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Ahorro } from '../models/ingreso.model';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface IngresoPayload {
  descripcion: string;
  monto: number;
  tipo: string;
  fecha: string;
}

export interface AhorroPayload {
  descripcion: string;
  monto: number;
  categoria: string;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class IngresoService {
  private http = inject(HttpClient);

  getData(): Observable<ApiResponse<{ ingresos: any[]; ahorros: Ahorro[] }>> {
    return this.http.get<ApiResponse<{ ingresos: any[]; ahorros: Ahorro[] }>>(`${environment.apiUrl}/ingresos`)
      .pipe(catchError(this.handleError));
  }

  createIngreso(payload: IngresoPayload): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${environment.apiUrl}/ingresos`, payload)
      .pipe(catchError(this.handleError));
  }

  updateIngreso(id: string, payload: IngresoPayload): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${environment.apiUrl}/ingresos/${id}`, payload)
      .pipe(catchError(this.handleError));
  }

  deleteIngreso(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${environment.apiUrl}/ingresos/${id}`)
      .pipe(catchError(this.handleError));
  }

  getTotal(): Observable<ApiResponse<{ total: number }>> {
    return this.http.get<ApiResponse<{ total: number }>>(`${environment.apiUrl}/ingresos/total`)
      .pipe(catchError(this.handleError));
  }

  createAhorro(payload: AhorroPayload): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${environment.apiUrl}/ahorros`, payload)
      .pipe(catchError(this.handleError));
  }

  updateAhorro(id: string, payload: AhorroPayload): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${environment.apiUrl}/ahorros/${id}`, payload)
      .pipe(catchError(this.handleError));
  }

  deleteAhorro(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${environment.apiUrl}/ahorros/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    const message = error.error?.message || `Error (${error.status})`;
    return throwError(() => new Error(message));
  }
}