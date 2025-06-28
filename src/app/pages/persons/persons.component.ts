import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { ApiService } from '../../services/api.service';
import { Person } from '../../interfaces/person-interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateComponent, EditComponent],
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})

export class PersonsComponent implements OnInit {
  private allPersons: Person[] = [];
  persons: Person[] = [];
  selectedPerson: Person | null = null;
  showCreate = false;
  showEdit = false;
  editMode = false;

  isAscendingId = true; //Variable que se utiliza para el sortById

  currentPage = 1; // Página inicial
  pageSize = 10; // Esto nos limita la cantidad de filas por página
  totalPages = 0; // Esto setea la cantidad de página que queremos

  constructor(private apiService: ApiService) { }

  async ngOnInit() {
    this.allPersons = await this.apiService.getPersons();
    this.totalPages = Math.ceil(this.allPersons.length / this.pageSize);
    this.refreshView();
  }

  async sortById() {
    try {
      this.allPersons.sort((a, b) =>
        this.isAscendingId ? a.id - b.id : b.id - a.id
      );
      this.isAscendingId = !this.isAscendingId; // alterna el orden
      this.refreshView();
    } catch (error) {
      throw error;
    }
  }

  private refreshView() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.persons = this.allPersons.slice(start, start + this.pageSize);
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.refreshView();
    }
  }

  goToSelectPage() {
    if (this.currentPage) {
      this.refreshView();
    }
  }

  goToPrevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.refreshView();
    }
  }

  goToCreate() { this.showCreate = true; }

  closeCreate() {
    const modalContent = document.querySelector('.modal-content') as HTMLElement;
    const modalContainer = document.querySelector('.modal-container') as HTMLElement;
    if (modalContent && modalContainer) {
      modalContent.classList.add('closing');
      modalContainer.classList.add('closing');
      setTimeout(() => (this.showCreate = false), 300);
    }
  }

  toggleEditMode() {
    // Esto nos cambia el valor de editMode
    this.editMode = !this.editMode;
  }

  onRowEdit(person: Person) {
    this.selectedPerson = person;
    this.showEdit = true;
  }

  selectAndEdit(person: Person) {
    this.selectedPerson = person;
    this.showEdit = true;
    this.editMode = false;
  }

  closeEdit() {
    const modalContent = document.querySelector('.modal-content') as HTMLElement;
    const modalContainer = document.querySelector('.modal-container') as HTMLElement;
    if (modalContent && modalContainer) {
      modalContent.classList.add('closing');
      modalContainer.classList.add('closing');

      setTimeout(() => {
        this.showEdit = false;
        this.selectedPerson = null;
      }, 300);
    }
  }

  confirmEdit() {
    // Acá debería ir la implementación de la confirmación, no?
    this.showEdit = false;
    this.selectedPerson = null;
  }

  onPersonSaved(updated: Person) {
    const idx = this.persons.findIndex(p => p.id === updated.id);
    if (idx > -1) this.persons[idx] = updated;
    this.showEdit = false;
    this.selectedPerson = null;
  }
}