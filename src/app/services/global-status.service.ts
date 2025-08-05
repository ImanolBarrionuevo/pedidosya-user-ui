/**
 * Servicio global para gestionar el estado de carga de la aplicación.
 * Permite indicar si la app está cargando datos y acceder a ese estado desde cualquier componente.
 */

import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalStatusService {
  private loading = signal(false); // Señal interna para el estado de carga

  isLoading = this.loading.asReadonly(); //Estado de carga solo lectura para los componentes

  setLoading(value: boolean) {
    this.loading.set(value); // Actualiza el estado de carga
  }
}
