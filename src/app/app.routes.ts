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
    path: 'home', component: TemplateComponent, children: [
      {
        path: '',
        component: HomeComponent,
      },
    ], canActivate: [canActivateFn]
  },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'persons', component: PersonsComponent, canActivate: [canActivateFn] },
  { path: 'create', component: CreateComponent, canActivate: [canActivateFn] },
  { path: 'edit', component: EditComponent, canActivate: [canActivateFn] },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }, // Redirige a login si la ruta no existe
];
