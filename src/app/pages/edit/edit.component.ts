import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { City, Country, Province } from '../../interfaces/person-interface';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-person',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {
  private _showEdit = false;

  @Input() set showEdit(value: boolean) {
    if (this._showEdit === value) return;
    this._showEdit = value;
    if (this._showEdit) {
      setTimeout(() => {
        const modalContainer = document.querySelector('.modal-container') as HTMLElement;
        if (modalContainer && !modalContainer.classList.contains('active')) {
          modalContainer.classList.add('active');
        }
      }, 50);
    }
  }

  get showEdit(): boolean {
    return this._showEdit;
  }

  @Output() close = new EventEmitter<void>(); // Evento para cerrar el modal

  personForm: FormGroup;
  cities: City[] = [];
  countries: Country[] = [];
  provinces: Province[] = [];

  // Listas de opciones para los selects
  // Tenemos que hacer que se importen de la BD
  //countries = ['Argentina', 'Brazil', 'Chile', 'Uruguay'];
  //provinces = ['Buenos Aires', 'Córdoba', 'Santa Fe'];
  //cities = ['Villa Nueva', 'Córdoba', 'Rosario'];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.personForm = this.fb.group({
      name: ['', Validators.required],
      birthdate: ['', Validators.required],
      email: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      country: ['', Validators.required]
    })
  }

  closeEdit() {
    this.close.emit();
  }

  confirmEdit() {
    this.close.emit();
  }

  ngOnInit() {
    this.getCountries(),
      this.getProvinces(),
      this.getCities()
  }

  async editPerson() {
    if (this.personForm.invalid) {
      return; //Si es invalido que deberiamos retornar? Mostrar error en la ui??
    }
    try {
      const { name, birthdate, email, city } = this.personForm.value; //verificar como sacar id de city
      await this.apiService.createPersons(name, birthdate, email, city);
      await this.router.navigate(['/persons']);
    } catch {
      console.error("Fallo che"); //Que error debemos poner?
    }
  }

  async getCountries() {
    try {
      this.countries = await this.apiService.getCountries()
    } catch (error) {
      console.log(error)
    }
  }

  async getProvinces() {
    try {
      this.provinces = await this.apiService.getProvinces()
    } catch (error) {
      console.log(error)
    }
  }

  async getCities() {
    try {
      this.cities = await this.apiService.getCities()
    } catch (error) {
      console.log(error)
    }
  }
}


