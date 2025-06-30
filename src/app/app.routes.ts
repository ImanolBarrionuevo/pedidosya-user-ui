import { Routes } from '@angular/router';
import { TemplateComponent } from './pages/template/template.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PersonsComponent } from './pages/persons/persons.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { CreateComponent } from './pages/create/create.component';
import { EditComponent } from './pages/edit/edit.component';
import { canActivateFn } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: TemplateComponent,
    canActivate: [canActivateFn],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'persons', component: PersonsComponent },
      { path: 'create', component: CreateComponent },
      { path: 'edit', component: EditComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
