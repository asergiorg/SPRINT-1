import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatabaseService } from './database-service';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';

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

  update(id: string, data: Reservation): Observable<any> {
    return this.http.put(`${this.baseUrl}/reservations/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/reservations/${id}`);
  }
}
