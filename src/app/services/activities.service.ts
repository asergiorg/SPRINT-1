import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Activity } from '../models/activity.model';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {

  readonly baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient){}

  getAll(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.baseUrl}/activities`)
    .pipe(catchError(this.handleError));
  }

  getById(id: string): Observable<Activity> {
    return this.http.get<Activity>(`${this.baseUrl}/activities/${id}`)
    .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

}
