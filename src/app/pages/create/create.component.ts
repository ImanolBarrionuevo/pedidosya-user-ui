import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { City, Country, Province } from '../../interfaces/person-interface';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-create-person',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})

export class CreateComponent {
  private _showCreate = false;

  @Input() set showCreate(value: boolean) {
    if (this._showCreate === value) return;
    this._showCreate = value;
    if (this._showCreate) {
      setTimeout(() => {
        const modalContainer = document.querySelector('.modal-container') as HTMLElement;
        if (modalContainer && !modalContainer.classList.contains('active')) {
          modalContainer.classList.add('active');
        }
      }, 50);
    }
  }

  get showCreate(): boolean {
    return this._showCreate;
  }

  @Output() close = new EventEmitter<void>(); // Evento para cerrar el modal

  personForm: FormGroup;
  cities: City[] = [];
  countries: Country[] = [];
  provinces: Province[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
  ) {
    this.personForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[^0-9]+$/)]],
      birthdate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      city: ['', Validators.required],
      province: ['', Validators.required],
      country: ['', Validators.required]
    })
  }

  closeCreate() {
    this.close.emit();
  }

  confirmCreate() {
    this.close.emit();
  }

  ngOnInit() {
    this.getCountries()
  }

  async createPerson() {
    if (this.personForm.invalid) {
      return; //Si es invalido que deberiamos retornar? Mostrar error en la ui??
    }
    try {
      const { name, birthdate, email, city } = this.personForm.value; //verificar como sacar id de city
      await this.apiService.createPersons(name, birthdate, email, city.id);
    } catch (error) {
      console.error(error); //Que error debemos poner?
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
      //Vaciamos el listado de ciudades al cargar las provincias para evitar que al cambiar de pais quede guardada la ciudad anterior
      this.cities = []
      const selectedCountry = this.personForm.get('country')?.value;
      this.provinces = await this.apiService.getProvincesByCountry(selectedCountry.id)
      this.personForm.get('province')!.reset(null);
      this.personForm.get('province')!.markAsTouched();
    } catch (error) {
      console.log(error)
    }
  }

  async getCities() {
    try {
      const selectedProvince = this.personForm.get('province')?.value;
      this.cities = await this.apiService.getCitiesByProvince(selectedProvince.id)
      this.personForm.get('city')!.reset(null);
      this.personForm.get('city')!.markAsTouched();
    } catch (error) {
      console.log(error)
    }
  }

  async validateDate(){
    const currentDate = new Date();
    const selectDate = new Date(await this.personForm.get('birthdate')?.value); //Es de tipo string
    console.log(typeof selectDate);
    if(currentDate < selectDate){
      console.log("Entre al if");
      this.personForm.get('birthdate')?.reset();
      this.personForm.get('birthdate')?.markAsTouched();
    }
  }
}

