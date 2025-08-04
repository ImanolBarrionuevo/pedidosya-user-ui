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
  private allPersons: Person[] = []; // Lista completa de personas obtenidas de la API
  persons: Person[] = [];
  selectedPerson: Person | null = null; // Persona seleccionada para editar
  showCreate = false;
  showEdit = false;
  editMode = false;

  isAscendingId = true; // Indica el orden actual, ascendente o descendente, de la columna ID

  currentPage = 1; // Página inicial
  pageSize = 10; // Cantidad de filas por página
  totalPages = 0; // Setea la cantidad de páginas

  constructor(private apiService: ApiService) { }

  // Método de inicialización que se ejecuta al cargar el componente
  async ngOnInit() {
    this.allPersons = await this.apiService.getPersons(); // Obtiene todas las personas de la API
    this.totalPages = Math.ceil(this.allPersons.length / this.pageSize); // Calcula el total de páginas
    this.refreshView();
  }

  // Método para ir a la página de creación de una nueva persona  
  goToCreate() {
    this.showCreate = true;
  }

  // Cierra el modal de creación y desbloquea el scroll
  closeCreate() {
    const modalContent = document.querySelector('.modal-content') as HTMLElement;
    const modalContainer = document.querySelector('.modal-container') as HTMLElement;
    if (modalContent && modalContainer) {
      modalContent.classList.add('closing');
      modalContainer.classList.add('closing');
      setTimeout(() => (this.showCreate = false), 300);
    }
  }

  // Maneja el evento de creación de una nueva persona
  onPersonCreated(newPerson: Person) {
    this.allPersons.push(newPerson); // Agrega la persona al final de la lista de todas las personas
    this.totalPages = Math.ceil(this.allPersons.length / this.pageSize); // Calcula el totalPages nuevo
    this.refreshView(); // Actualiza el slice actual de persons
    this.showCreate = false; // Cierra el modal
  }

  // Abre el modal de edición para la persona seleccionada.
  onRowEdit(person: Person) {
    this.selectedPerson = person;
    this.showEdit = true;
  }

  // Selecciona una persona y abre el modal de edición, desactivando el modo edición.
  selectAndEdit(person: Person) {
    this.selectedPerson = person;
    this.showEdit = true;
    this.editMode = false;
  }

  // Cierra el modal de edición con animación.
  closeEdit() {
    const modalContent = document.querySelector('.modal-content') as HTMLElement;
    const modalContainer = document.querySelector('.modal-container') as HTMLElement;
    if (modalContent && modalContainer) {
      modalContent.classList.add('closing'); // Agrega la clase de cierre para animación
      modalContainer.classList.add('closing');

      setTimeout(() => {
        this.showEdit = false; // Desactiva el modal de edición
        this.selectedPerson = null; // Limpia la persona seleccionada
      }, 300);
    }
  }

  // Confirma la edición de la persona seleccionada y cierra el modal
  confirmEdit() {
    this.showEdit = false;
    this.selectedPerson = null;
  }

  // Maneja el evento de guardado de una persona editada
  onPersonSaved(updated: Person) {
    const personIndex = this.allPersons.findIndex(p => p.id === updated.id);
    if (personIndex > -1) {
      this.allPersons[personIndex] = updated;
    }
    this.refreshView(); // Actualiza la vista con la persona editada
    this.confirmEdit(); // Cierra el modal y limpia la persona seleccionada
  }

  // Método para navegar a la página siguiente
  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.refreshView();
    }
  }

  // Método para navegar a la página seleccionada
  goToSelectPage() {
    if (this.currentPage) {
      this.refreshView();
    }
  }

  // Método para navegar a la página anterior
  goToPrevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.refreshView();
    }
  }

  // Método para ordenar por ID. Alterna entre orden ascendente y descendente.
  async sortById() {
    try {
      this.allPersons.sort((a, b) =>
        this.isAscendingId ? a.id - b.id : b.id - a.id
      );
      this.isAscendingId = !this.isAscendingId; // Altera el orden
      this.refreshView(); // Actualiza la vista con el nuevo orden
    } catch (error) {
      throw error;
    }
  }

  // Actualiza la vista de personas según la página actual y el tamaño de página
  private refreshView() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.persons = this.allPersons.slice(start, start + this.pageSize);
  }

  // Alterna el modo de edición
  toggleEditMode() {
    this.editMode = !this.editMode;
  }
}