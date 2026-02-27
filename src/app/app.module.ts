import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JournalListComponent } from './journal-list/journal-list.component';
import { JournalFormComponent } from './journal-form/journal-form.component';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { CollectionFormComponent } from './collection-form/collection-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { environment } from '../environments/environments';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { FirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AboutComponent } from './about/about.component';
import { LayoutComponent } from './layout/layout.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent, JournalListComponent, JournalFormComponent,
    CollectionListComponent, CollectionFormComponent,
    LoginComponent, RegisterComponent, AboutComponent, LayoutComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule, AppRoutingModule, BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    MatSidenavModule, MatListModule, MatIconModule, MatProgressSpinnerModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule,
    MatToolbarModule, MatTooltipModule, MatRippleModule,
    MatDialogModule, MatPaginatorModule, MatButtonToggleModule,
    MatChipsModule, MatSelectModule,
    FirestoreModule, AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
