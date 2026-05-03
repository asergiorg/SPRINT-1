import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private firestore = inject(Firestore);
  private collectionName = 'activities';

  getActivities(): Observable<any> {
    const ref = collection(this.firestore, this.collectionName);
    return collectionData(ref, { idField: 'id' });
  }

  getActivityById(id: string): Observable<any> {
    const ref = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(ref, { idField: 'id' });
  }
}
