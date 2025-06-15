import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-person',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
  @Input() showCreate = false; // Recibe el estado del modal
  @Output() close = new EventEmitter<void>(); // Evento para cerrar el modal

  personForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.personForm = this.fb.group({
      name: [''],
      surname: [''],
      city: [''],
      province: [''],
      country: ['']
    });
  }

  closeCreate() {
    this.close.emit(); // Notifica a `PersonsComponent` que se cerró el modal
  }

  confirmCreate() {
    this.close.emit(); // Cierra el modal después de crear la persona
  }
}

