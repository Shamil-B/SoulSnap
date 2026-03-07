import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { JournalListComponent } from './journal-list/journal-list.component';
import { CollectionFormComponent } from './collection-form/collection-form.component';
import { JournalFormComponent } from './journal-form/journal-form.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AboutComponent } from './about/about.component';
import { LayoutComponent } from './layout/layout.component';
import { LandingComponent } from './landing/landing.component';
import { SearchComponent } from './search/search.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'collections', component: CollectionListComponent },
      { path: 'collections/:collectionId/journals/:title', component: JournalListComponent },
      { path: 'create-collection/:collectionId/:title', component: CollectionFormComponent },
      { path: 'create-journal/:collectionId/:journalId/:title', component: JournalFormComponent },
      { path: 'search', component: SearchComponent },
      { path: 'about', component: AboutComponent },
    ]
  },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
