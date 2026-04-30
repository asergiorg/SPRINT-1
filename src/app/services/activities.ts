import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, collectionData, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity.model';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private firestore = inject(Firestore);
  private collectionName = 'activities';

  async addActivity(data: Activity): Promise<string> {
    try {
      const ref = collection(this.firestore, this.collectionName);
      const docRef = await addDoc(ref, data);
      return docRef.id;
    } catch (error) {
      console.error("Error al añadir Activity:", error);
      throw error;
    }
  }

  getActivities(): Observable<any> {
    const ref = collection(this.firestore, this.collectionName);
    // Inyecta el ID del documento dentro del payload bajo la propiedad 'id'
    return collectionData(ref, { idField: 'id' });
  }

  getActivityById(id: string): Observable<any> {
    const ref = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(ref, { idField: 'id' });
  }

  async updateActivity(id: string, data: any): Promise<void> {
    try {
      const ref = doc(this.firestore, `${this.collectionName}/${id}`);
      await updateDoc(ref, data);
    } catch (error) {
      console.error("Error al actualizar Activity:", error);
      throw error;
    }
  }

  async deleteActivity(id: string): Promise<void> {
    try {
      const ref = doc(this.firestore, `${this.collectionName}/${id}`);
      await deleteDoc(ref);
    } catch (error) {
      console.error("Error al eliminar Activity:", error);
      throw error;
    }
  }

}
