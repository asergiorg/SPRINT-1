import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';

// Firebase Imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "",
  authDomain: ".firebaseapp.com",
  projectId: "",
  storageBucket: ".appspot.com",
  messagingSenderId: "",
  appId: ""
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



