import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';

import { AutocompleteLibModule } from 'angular-ng-autocomplete';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AutocompleteLibModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions(getApp(), 'australia-southeast1')),
    provideMessaging(() => getMessaging()),
    provideStorage(() => getStorage()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
