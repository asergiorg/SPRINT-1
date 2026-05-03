import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBH9L9_Qo2sSGu4wsC0jCEv0ojIBoQvaq4",
  authDomain: "grand-aventures-8b3d9.firebaseapp.com",
  projectId: "grand-aventures-8b3d9",
  storageBucket: "grand-aventures-8b3d9.firebasestorage.app",
  messagingSenderId: "766049528697",
  appId: "1:766049528697:web:edbbe6fd283a07c273dda8",
  measurementId: "G-Q2FSLCWG2B"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),

    provideFirebaseApp(() => initializeApp(firebaseConfig)),

    provideFirestore(() => getFirestore()),

    provideAuth(() => getAuth()),
  ]
};



