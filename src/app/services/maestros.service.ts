import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class MaestrosService {
    private apiUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private localStorageService: LocalStorageService
    ) { }

    private getHeaders(): HttpHeaders {
        const token = this.localStorageService.getItem('authToken');
        return new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
    }

    // --- Establecimientos de Sacrificio ---

    getEstablecimientos(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/api/maestros/establecimientos`, { headers: this.getHeaders() });
    }

    getEstablecimientoById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/api/maestros/establecimientos/${id}`, { headers: this.getHeaders() });
    }

    createEstablecimiento(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/api/maestros/establecimientos`, data, { headers: this.getHeaders() });
    }

    updateEstablecimiento(id: number, data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/api/maestros/establecimientos/${id}`, data, { headers: this.getHeaders() });
    }

    deleteEstablecimiento(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/api/maestros/establecimientos/${id}`, { headers: this.getHeaders() });
    }

    // --- Empresas Consignatarias ---

    getConsignatarias(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/api/maestros/consignatarias`, { headers: this.getHeaders() });
    }

    getConsignatariaById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/api/maestros/consignatarias/${id}`, { headers: this.getHeaders() });
    }

    createConsignataria(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/api/maestros/consignatarias`, data, { headers: this.getHeaders() });
    }

    updateConsignataria(id: number, data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/api/maestros/consignatarias/${id}`, data, { headers: this.getHeaders() });
    }

    deleteConsignataria(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/api/maestros/consignatarias/${id}`, { headers: this.getHeaders() });
    }
}
