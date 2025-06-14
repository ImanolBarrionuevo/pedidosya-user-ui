import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-persons',
  imports: [],
  templateUrl: './persons.component.html',
  styleUrl: './persons.component.css'
})
export class PersonsComponent {
  constructor(private router: Router) { }

  goToCreate() {
    this.router.navigate(['/create']);
  }

  goToEdit() {
    this.router.navigate(['/edit']);
  }

  goToNextPage() {
    this.router.navigate(['']); // Ver como sería la ruta con paginación
  }

  /*
  currentPage: number = 1;
  totalPages = [1, 2, 3];

  goToPage(page: number) {
    this.currentPage = page;
    this.goToNextPage();  // o tu lógica de paginación
  }
  */ 
}
