/**
 * Componente raíz de la aplicación Angular.
 * Define el punto de entrada y la estructura principal de la app.
 */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pedidos-ya'; // Título de la aplicación
}
