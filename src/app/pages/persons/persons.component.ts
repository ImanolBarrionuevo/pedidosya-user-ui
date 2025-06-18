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
  ){ }

  ngOnInit(){
    this.getPersons();
  }

  goToCreate() {
    console.log("Opening Create modal"); // 🔹 Debug en la consola
    this.showCreate = true;
  }

  closeCreate() {
    console.log("Closing Create modal"); // 🔹 Debug en la consola
    this.showCreate = false;
  }

  goToEdit() {
    this.showEdit = true;
  }

  goToNextPage() {
    console.log('Going to next page...');
  }

  async getPersons(){
    try{
      this.persons = await this.apiService.getPersons()
    } catch(error){
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
