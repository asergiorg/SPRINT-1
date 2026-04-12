import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatabaseService } from './database-service';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesDatabaseService implements DatabaseService {
  private http = inject(HttpClient); 
  private baseUrl = 'http://localhost:3000';

  getAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/activities`);
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/activities/${id}`);
  }

  save(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/activities`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/activities/${id}`);
  }
}
