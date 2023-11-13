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
import { HomeComponent } from './home/home.component';

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
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatSidenavModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
