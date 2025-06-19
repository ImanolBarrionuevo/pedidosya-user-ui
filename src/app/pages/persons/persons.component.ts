import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { ApiService } from '../../services/api.service';
import { Person } from '../../interfaces/person-interface';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [CommonModule, CreateComponent, EditComponent],
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})

export class PersonsComponent {
  showCreate = false;
  showEdit = false;
  selectedPerson: Person | null = null;
  persons: Person[] = [
    {
      id: 1,
      name: 'Gabriel Pérez',
      birthDate: new Date('1990-05-10'),
      email: 'gabriel.perez@mail.com',
      city: {
        id: 1,
        name: 'Córdoba',
        province: {
          id: 1,
          name: 'Córdoba',
          country: {
            id: 1,
            name: 'Argentina'
          }
        }
      }
    },
    {
      id: 2,
      name: 'María López',
      birthDate: new Date('1985-12-01'),
      email: 'maria.lopez@mail.com',
      city: {
        id: 2,
        name: 'Rosario',
        province: {
          id: 2,
          name: 'Santa Fe',
          country: {
            id: 1,
            name: 'Argentina'
          }
        }
      }
    },
    {
      id: 3,
      name: 'Lucas Pratto',
      birthDate: new Date('2018-09-12'),
      email: 'yvaeltercero@gmail.com',
      city: {
        id: 3,
        name: 'Villa Maria',
        province: {
          id: 1,
          name: 'Cordoba',
          country: {
            id: 1,
            name: 'Argentina'
          }
        }
      }
    },
    {
      id: 4,
      name: 'Ngolo Kante',
      birthDate: new Date('1988-06-25'),
      email: 'ngolongoloKANTE@gmail.com',
      city: {
        id: 4,
        name: 'null',
        province: {
          id: 6,
          name: 'Not Null',
          country: {
            id: 4,
            name: 'Francia'
          }
        }
      }
    }
  ];

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    //this.getPersons();
  }

  goToCreate() {
    if (!this.showCreate) {
      this.showCreate = true;
    }
  }

  closeCreate() {
    const modalContent = document.querySelector('.modal-content') as HTMLElement;
    const modalContainer = document.querySelector('.modal-container') as HTMLElement;

    if (modalContent && modalContainer) {
      modalContent.classList.add('closing');
      modalContainer.classList.add('closing');

      setTimeout(() => {
        this.showCreate = false;
      }, 300);
    }
  }
    onSelect(person: Person) {
      this.selectedPerson = person;
    }

    goToEdit() {
      if (!this.selectedPerson) {
        alert('Primero seleccioná una persona de la tabla');
        return;
      }
      this.showEdit = true;
    }
    
    /*
    Dejo comentado el anterior goToEdit por las dudas.
    goToEdit() {
      if (!this.showEdit) {
        this.showEdit = true;
      }
    }
    */
    
  
    closeEdit() {
      const modalContent = document.querySelector('.modal-content') as HTMLElement;
      const modalContainer = document.querySelector('.modal-container') as HTMLElement;
  
      if (modalContent && modalContainer) {
        modalContent.classList.add('closing');
        modalContainer.classList.add('closing');
  
        setTimeout(() => {
          this.showEdit = false;
        }, 300);
      }
    }

  goToNextPage() {
    console.log('Going to next page...'); //hacer
  }

  async getPersons() {
    try {
      this.persons = await this.apiService.getPersons()
    } catch (error) {
      console.log(error)
    }
  }
}