import { Observable } from "rxjs";

export interface DatabaseService {
    getAll(): Observable<any>;
    save(data: any): Observable<any>;
    delete(id: string): Observable<any>;
}