import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JournalListComponent } from './journal-list/journal-list.component';
import { JournalEntryComponent } from './journal-entry/journal-entry.component';
import { JournalFormComponent } from './journal-form/journal-form.component';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { CollectionEntryComponent } from './collection-entry/collection-entry.component';
import { CollectionFormComponent } from './collection-form/collection-form.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import {FormsModule} from '@angular/forms';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { environment } from '../environments/environments';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    JournalListComponent,
    JournalEntryComponent,
    JournalFormComponent,
    CollectionListComponent,
    CollectionEntryComponent,
    CollectionFormComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FirestoreModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
