import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { lastValueFrom, Observable } from 'rxjs';
import { ReviewData } from '../pages/activity-information/activity-information';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private firestore = inject(Firestore);
  private collectionName = 'reviews';

  constructor(private http: HttpClient) {}

  async addReview(data: ReviewData): Promise<string> {
    try {
      const ref = collection(this.firestore, this.collectionName);
      const docRef = await addDoc(ref, data);
      return docRef.id;
    } catch (error) {
      console.error('Error al añadir Review:', error);
      throw error;
    }
  }

  getReviews(): Observable<any> {
    const ref = collection(this.firestore, this.collectionName);
    return collectionData(ref, { idField: 'id' });
  }

  getReviewById(id: string): Observable<any> {
    const ref = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(ref, { idField: 'id' });
  }

  async updateReview(id: string, data: any): Promise<void> {
    try {
      const ref = doc(this.firestore, `${this.collectionName}/${id}`);
      await updateDoc(ref, data);
    } catch (error) {
      console.error('Error al actualizar Review:', error);
      throw error;
    }
  }

  async uploadToCloudinary(file: File): Promise<string> {
    const cloudName = 'dro3xapg0';
    const uploadPreset = 'reseñas';
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response: any = await lastValueFrom(this.http.post(url, formData));
    return response.secure_url;
  }
}
