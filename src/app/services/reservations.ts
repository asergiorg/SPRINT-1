import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { DatabaseService } from './database-service';

@Injectable({
  providedIn: 'root'
})
export class ReservationsDatabaseService implements DatabaseService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';

  getAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/reservations`);
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/reservations/${id}`);
  }

  save(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reservations`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/reservations/${id}`);
  }
}
