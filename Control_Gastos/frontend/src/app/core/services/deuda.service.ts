import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Deuda, PagoDeuda } from '../models/deuda.model';
import { Observable, catchError, throwError } from 'rxjs';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface DeudaPayload {
  acreedor: string;
  monto_total: number;
  cuota_mensual: number;
  tasa_interes: number;
  estado: string;
  fecha_inicio: string;
  vencimiento: string;
}

export interface PagoPayload {
  deuda_id: string;
  monto: number;
  fecha: string;
  nota: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeudaService {
  private http = inject(HttpClient);

  getData(): Observable<ApiResponse<{ deudas: Deuda[]; pagos: PagoDeuda[] }>> {
    return this.http.get<ApiResponse<{ deudas: Deuda[]; pagos: PagoDeuda[] }>>(`${environment.apiUrl}/deudas`)
      .pipe(catchError(this.handleError));
  }

  createDeuda(payload: DeudaPayload): Observable<ApiResponse<Deuda>> {
    return this.http.post<ApiResponse<Deuda>>(`${environment.apiUrl}/deudas`, payload)
      .pipe(catchError(this.handleError));
  }

  updateDeuda(id: string, payload: DeudaPayload): Observable<ApiResponse<Deuda>> {
    return this.http.put<ApiResponse<Deuda>>(`${environment.apiUrl}/deudas/${id}`, payload)
      .pipe(catchError(this.handleError));
  }

  deleteDeuda(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${environment.apiUrl}/deudas/${id}`)
      .pipe(catchError(this.handleError));
  }

  createPago(payload: PagoPayload): Observable<ApiResponse<PagoDeuda>> {
    return this.http.post<ApiResponse<PagoDeuda>>(`${environment.apiUrl}/deudas/pagos`, payload)
      .pipe(catchError(this.handleError));
  }

  updatePago(id: string, payload: PagoPayload): Observable<ApiResponse<PagoDeuda>> {
    return this.http.put<ApiResponse<PagoDeuda>>(`${environment.apiUrl}/deudas/pagos/${id}`, payload)
      .pipe(catchError(this.handleError));
  }

  deletePago(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${environment.apiUrl}/deudas/pagos/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    const message = error.error?.message || `Error (${error.status})`;
    return throwError(() => new Error(message));
  }
}