import { Injectable, inject } from "@angular/core";
import { DatabaseService } from "./database-service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class ReviewsService implements DatabaseService {
    private http = inject(HttpClient);
    private baseUrl = "http://localhost:3000/reviews";

    getAll(): Observable<any[]> {
        return this.http.get<any[]>(this.baseUrl);
    }

    save(data: any): Observable<any> {
        return this.http.post(this.baseUrl, data);
    }

    delete(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
}