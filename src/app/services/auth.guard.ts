/**
 * Guardia de autenticación para rutas protegidas.
 * Verifica si existe un token de acceso en localStorage.
 * Si no hay token, redirige al login y bloquea el acceso.
 */

import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const canActivateFn: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const isToken = localStorage.getItem('accessToken');

  // Permite el acceso si hay token
  if (isToken) {
    return true;
  }

  // Bloquea el acceso y redirige al login si no hay token
  router.navigate(['/login']);
  return false;
};