import { Component } from '@angular/core';
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

export class PersonsComponent {
  showCreate = false;
  showEdit = false;
  editMode      = false;
  selectedPerson: Person | null = null;
  persons: Person[] = [];

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    this.getPersons();
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

  enableEditMode() {
    this.editMode = true;
    this.selectedPerson = null;
  }

  onRowEdit(person: Person) {
    this.selectedPerson = person;
    this.showEdit = true;
  }

  /** Cuando seleccionás la fila, abrimos directamente el modal */
  selectAndEdit(person: Person) {
    this.selectedPerson = person;
    this.showEdit = true;
    this.editMode = false;
  }
  
  closeEdit() {
    this.showEdit = false;
    this.selectedPerson = null;   // Esto debería desmarcar la casilla pero no lo está haciendo
  }

  confirmEdit() {
    // Implementar lógica de la confirmación
    this.showEdit = false;
    this.selectedPerson = null;
  }

  goToNextPage() {
    console.log('Going to next page...'); // Implementar
  }

  async getPersons() {
    try {
      this.persons = await this.apiService.getPersons()
    } catch (error) {
      console.log(error)
    }
  }

  onPersonSaved(updated: Person) {
    // 4) Sustituimos la persona en el array para que la tabla refresque
    const idx = this.persons.findIndex(p => p.id === updated.id);
    if (idx > -1) this.persons[idx] = updated;

    this.showEdit = false;
    this.selectedPerson = null; 
  }
}