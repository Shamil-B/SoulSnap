import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { CollectionEntryComponent } from './collection-entry/collection-entry.component';
import { JournalListComponent } from './journal-list/journal-list.component';
import { JournalEntryComponent } from './journal-entry/journal-entry.component';
import { CollectionFormComponent } from './collection-form/collection-form.component';
import { JournalFormComponent } from './journal-form/journal-form.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', redirectTo: '/collections', pathMatch: 'full' },
  { path: 'collections', component: CollectionListComponent },
  { path: 'collections/:id', component: CollectionEntryComponent },
  { path: 'collections/:collectionId/journals', component: JournalListComponent },
  { path: 'collections/:collectionId/journals/:journalId', component: JournalEntryComponent },
  { path: 'create-collection/:collectionId', component: CollectionFormComponent },
  { path: 'create-journal/:collectionId/:journalId', component: JournalFormComponent },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: '**', redirectTo: '/login'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
