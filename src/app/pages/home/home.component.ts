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
  items: Array<{ image: string; name: string; description: string; category: string }> = [];
  foodItems: typeof this.items = [];
  dessertItems: typeof this.items = [];

  constructor(
    private readonly apiService: ApiService,
    private readonly globalStatusService: GlobalStatusService
  ) { }
  ngOnInit(): void {
    this.initialization();
  }

  async initialization(): Promise<void> {
    this.globalStatusService.setLoading(true);
    const data = await this.apiService.getData();
    this.foodItems = data.filter(item => item.category === 'food');
    this.dessertItems = data.filter(item => item.category === 'dessert');
    this.globalStatusService.setLoading(false);
  }
}
