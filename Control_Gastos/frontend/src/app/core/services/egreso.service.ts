import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Egreso, EgresoCategoria } from '../models/egreso.model';
import { Observable, catchError, throwError } from 'rxjs';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface EgresoPayload {
  descripcion: string;
  monto: number;
  tipo: string;
  fecha: string;
}

export interface EgresoCategoriaPayload {
  descripcion: string;
  monto: number;
  categoria: string;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class EgresoService {
  private http = inject(HttpClient);

  getData(): Observable<ApiResponse<{ egresos: Egreso[]; categorias: EgresoCategoria[] }>> {
    return this.http.get<ApiResponse<{ egresos: Egreso[]; categorias: EgresoCategoria[] }>>(`${environment.apiUrl}/egresos`)
      .pipe(catchError(this.handleError));
  }

  createEgreso(payload: EgresoPayload): Observable<ApiResponse<Egreso>> {
    return this.http.post<ApiResponse<Egreso>>(`${environment.apiUrl}/egresos`, payload)
      .pipe(catchError(this.handleError));
  }

  updateEgreso(id: string, payload: EgresoPayload): Observable<ApiResponse<Egreso>> {
    return this.http.put<ApiResponse<Egreso>>(`${environment.apiUrl}/egresos/${id}`, payload)
      .pipe(catchError(this.handleError));
  }

  deleteEgreso(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${environment.apiUrl}/egresos/${id}`)
      .pipe(catchError(this.handleError));
  }

  createCategoria(payload: EgresoCategoriaPayload): Observable<ApiResponse<EgresoCategoria>> {
    return this.http.post<ApiResponse<EgresoCategoria>>(`${environment.apiUrl}/egresos/categorias`, payload)
      .pipe(catchError(this.handleError));
  }

  updateCategoria(id: string, payload: EgresoCategoriaPayload): Observable<ApiResponse<EgresoCategoria>> {
    return this.http.put<ApiResponse<EgresoCategoria>>(`${environment.apiUrl}/egresos/categorias/${id}`, payload)
      .pipe(catchError(this.handleError));
  }

  deleteCategoria(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${environment.apiUrl}/egresos/categorias/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    const message = error.error?.message || `Error (${error.status})`;
    return throwError(() => new Error(message));
  }
}