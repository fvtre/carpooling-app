import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    ReactiveFormsModule,],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
    provideAuth(() => getAuth()), 
    provideFirebaseApp(() => initializeApp({"projectId":"carpooling-app-f7f2e",
      "appId":"1:302981360403:web:3bad9279b644ea1daac8e6",
      "storageBucket":"carpooling-app-f7f2e.appspot.com",
      "apiKey":"AIzaSyBUvys5CgjlJuCTrZBVXDDlsAU1nOjXCG4",
      "authDomain":"carpooling-app-f7f2e.firebaseapp.com",
      "messagingSenderId":"302981360403",
      "measurementId":"G-VB3CRDHTWE"})), 
    provideFirestore(() => getFirestore())],
  bootstrap: [AppComponent],
})
export class AppModule {}

