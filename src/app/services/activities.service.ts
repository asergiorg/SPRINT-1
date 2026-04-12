import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Activity } from '../models/activity.model';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {

  readonly jsonUrl = 'assets/data/activities.json';

  constructor(private http: HttpClient){}

  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.jsonUrl)
    .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

}
