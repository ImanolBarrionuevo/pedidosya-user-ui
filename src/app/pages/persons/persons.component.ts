import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from '../create/create.component';
import { ApiService } from '../../services/api.service';
import { Person } from '../../interfaces/person-interface';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [CommonModule, CreateComponent],
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})
export class PersonsComponent {
  showCreate = false;
  showEdit = false;
  persons: Person[] = []

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    this.getPersons();
  }

  goToCreate() {
    console.log("Opening Create modal...");
    if (!this.showCreate) {
      this.showCreate = true;
      console.log("showCreate activado:", this.showCreate);
    }
  }

  closeCreate() {
    console.log("Closing Create modal...");

    const modalContent = document.querySelector('.modal-content') as HTMLElement;
    const modalContainer = document.querySelector('.modal-container') as HTMLElement;

    if (modalContent && modalContainer) {
      modalContent.classList.add('closing');
      modalContainer.classList.add('closing');

      setTimeout(() => {
        this.showCreate = false; // 🔹 Se desactiva después de la animación
        console.log("showCreate desactivado:", this.showCreate);
      }, 300); // 🔹 Ajusta el tiempo según la duración de la animación
    }
  }

  goToEdit() {
    this.showEdit = true;
  }

  goToNextPage() {
    console.log('Going to next page...');
  }

  async getPersons() {
    try {
      this.persons = await this.apiService.getPersons()
    } catch (error) {
      console.log(error)
    }
  }
}


// export class PersonsComponent {
//   constructor(private router: Router) { }

//   goToCreate() {
//     this.router.navigate(['/create']);
//   }

//   goToEdit() {
//     this.router.navigate(['/edit']);
//   }

//   goToNextPage() {
//     this.router.navigate(['']); // Ver como sería la ruta con paginación
//   }

//   /*
//   currentPage: number = 1;
//   totalPages = [1, 2, 3];

//   goToPage(page: number) {
//     this.currentPage = page;
//     this.goToNextPage();  // o tu lógica de paginación
//   }
//   */
// }
