import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  user, 
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  
  public user$: Observable<any> = user(this.auth);

  async login(email: string, password: string, rememberMe: boolean) {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(this.auth, persistence);
    
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(userData: any) {
    const { email, password, fullname, username, birthday, gender, phone } = userData;

    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    
    await updateProfile(userCredential.user, { displayName: username });
    
    const userDocRef = doc(this.firestore, `users/${userCredential.user.uid}`);
    await setDoc(userDocRef, {
      fullname,
      username,
      birthday,
      gender,
      phone,
      email,
      createdAt: new Date().toISOString()
    });
    
    return userCredential;
  }

  logout() {
    return signOut(this.auth);
  }
}