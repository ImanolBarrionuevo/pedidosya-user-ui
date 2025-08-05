/**
 * Configuración principal de la aplicación Angular.
 * Define los proveedores globales, la detección de zona y el sistema de rutas.
 */

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Configuración global de la aplicación
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), // Optimiza la detección de cambios
  provideRouter(routes)] // Proveedor de rutas principales
};
