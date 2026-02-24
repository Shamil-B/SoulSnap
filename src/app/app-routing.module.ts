import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { JournalListComponent } from './journal-list/journal-list.component';
import { CollectionFormComponent } from './collection-form/collection-form.component';
import { JournalFormComponent } from './journal-form/journal-form.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  { path: '', redirectTo: '/collections', pathMatch: 'full' },
  { path: 'collections', component: CollectionListComponent },
  { path: 'collections/:collectionId/journals/:title', component: JournalListComponent },
  { path: 'create-collection/:collectionId/:title', component: CollectionFormComponent },
  { path: 'create-journal/:collectionId/:journalId/:title', component: JournalFormComponent },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'about', component: AboutComponent},
  { path: '**', redirectTo: '/login'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
