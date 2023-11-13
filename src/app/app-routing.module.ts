import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { CollectionEntryComponent } from './collection-entry/collection-entry.component';
import { JournalListComponent } from './journal-list/journal-list.component';
import { JournalEntryComponent } from './journal-entry/journal-entry.component';
import { CollectionFormComponent } from './collection-form/collection-form.component';
import { JournalFormComponent } from './journal-form/journal-form.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'collections', component: CollectionListComponent },
  {path: "home", component: HomeComponent},
  { path: 'collections/:id', component: CollectionEntryComponent },
  { path: 'collections/:collectionId/journals', component: JournalListComponent },
  { path: 'collections/:collectionId/journals/:journalId', component: JournalEntryComponent },
  { path: 'create-collection', component: CollectionFormComponent },
  { path: 'create-journal/:collectionId/:journalId', component: JournalFormComponent },
  {path: '**', redirectTo: '/home'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
