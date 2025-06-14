import { Routes } from '@angular/router';
import { TemplateComponent } from './pages/template/template.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PersonsComponent } from './pages/persons/persons.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';

export const routes: Routes = [
  {
    path: '',
    component: TemplateComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'persons', component: PersonsComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }, // Redirige a login si la ruta no existe
];
