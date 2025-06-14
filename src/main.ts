import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  ...appConfig, // Mantiene la configuración existente
  providers: [provideRouter(routes)] // Agrega el sistema de rutas
})
  .catch((err) => console.error(err));

