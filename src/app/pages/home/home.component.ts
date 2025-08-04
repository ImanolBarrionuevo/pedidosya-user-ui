import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { GlobalStatusService } from '../../services/global-status.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  items: Array<{ image: string; name: string; description: string; category: string }> = []; // Lista de ítems obtenidos de la API
  // Propiedades para almacenar los ítems filtrados por categoría
  foodItems: typeof this.items = []; // Items filtrados por categoría 'food'
  dessertItems: typeof this.items = []; // Items filtrados por categoría 'dessert'

  constructor(
    private readonly apiService: ApiService,
    private readonly globalStatusService: GlobalStatusService
  ) { }

  // Método de inicialización que se ejecuta al cargar el componente
  ngOnInit(): void {
    this.initialization();
  }

  // Método para manejar el cierre del modal
  async initialization(): Promise<void> {
    this.globalStatusService.setLoading(true); // Indica que se está cargando información
    const data = await this.apiService.getData(); // Obtiene los datos de la API
    this.foodItems = data.filter(item => item.category === 'food'); // Filtra los ítems por categoría
    this.dessertItems = data.filter(item => item.category === 'dessert');
    this.globalStatusService.setLoading(false); // Indica que la carga ha finalizado
  }
}
