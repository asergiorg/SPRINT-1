import { Injectable, inject } from '@angular/core';
import { Firestore,
        collection,
        doc,
        addDoc,
        updateDoc,
        deleteDoc,
        collectionData,
        docData,
        query,
        where
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';

export type NoIdReservation = Omit<Reservation, 'id'>;

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private firestore = inject(Firestore);
  private collectionName = 'reservations';

  async addReservation(data: NoIdReservation): Promise<string> {
    try {
      const ref = collection(this.firestore, this.collectionName);
      const docRef = await addDoc(ref, data);
      return docRef.id;
    } catch (error) {
      console.error("Error al añadir Reservation:", error);
      throw error;
    }
  }

  getReservations(): Observable<any> {
    const ref = collection(this.firestore, this.collectionName);
    return collectionData(ref, { idField: 'id' });
  }

  getReservationById(id: string): Observable<any> {
    const ref = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(ref, { idField: 'id' });
  }

  getReservationsByName(name: string): Observable<any> {
    const ref = collection(this.firestore, this.collectionName);
    const q = query(ref, where('holder', '==', name));
    return collectionData(q, { idField: 'id' });
  }

  async updateReservation(id: string, data: any): Promise<void> {
    try {
      const ref = doc(this.firestore, `${this.collectionName}/${id}`);
      await updateDoc(ref, data);
    } catch (error) {
      console.error("Error al actualizar Reservation:", error);
      throw error;
    }
  }

  async deleteReservation(id: string): Promise<void> {
    try {
      const ref = doc(this.firestore, `${this.collectionName}/${id}`);
      await deleteDoc(ref);
    } catch (error) {
      console.error("Error al eliminar Reservation:", error);
      throw error;
    }
  }

}
