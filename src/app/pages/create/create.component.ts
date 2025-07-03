import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { City, Country, Person, Province } from '../../interfaces/person-interface';
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
      document.body.classList.add('modal-open'); // Esta línea sirve para bloquear el scroll mientras el edit está abierto
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
  @Output() saved = new EventEmitter<Person>(); // Evento para guardar persona creada

  personForm: FormGroup;
  cities: City[] = [];
  countries: Country[] = [];
  provinces: Province[] = [];
  successMsg: string = ''
  errorMsg: string = ''

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
  ) {
    this.personForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÿ\s]+$/)]],
      birthDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      city: ['', Validators.required],
      province: ['', Validators.required],
      country: ['', Validators.required]
    })
  }

  closeCreate() {
    this.close.emit();
    document.body.classList.remove('modal-open');
  }

  ngOnInit() {
    //Bloqueamos la selección de provincia y ciudad
    this.personForm.get('province')?.disable();
    this.personForm.get('city')?.disable();
    this.getCountries()
  }

  async createPerson() {
    if (this.personForm.invalid) {
      this.personForm.markAllAsTouched(); //Si es invalido que deberiamos retornar? Mostrar error en la ui??
      this.errorMsg = 'Incomplete or incorrect information'
      return;
    }
    try {
      const { name, birthDate, email, city } = this.personForm.value; //verificar como sacar id de city
      const newPerson = await this.apiService.createPersons(name, birthDate, email, city.id);
      this.saved.emit(newPerson)
      this.errorMsg = ''
      this.successMsg = 'Persona creada correctamente';
      setTimeout(() => this.close.emit(), 2000)
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
      this.personForm.get('city')?.disable();
      //Habilitamos la opción de selección de province
      this.personForm.get('province')?.enable();
      const selectedCountry = this.personForm.get('country')?.value;
      this.provinces = await this.apiService.getProvincesByCountry(selectedCountry.id)
      this.personForm.get('province')!.reset(null);
      this.personForm.get('province')!.markAsTouched();
    } catch (error) {
      console.error('Algo salió mal', error)
    }
  }

  async getCities() {
    try {
      const selectedProvince = this.personForm.get('province')?.value;
      this.personForm.get('city')?.enable();
      this.cities = await this.apiService.getCitiesByProvince(selectedProvince.id)
      this.personForm.get('city')!.reset(null);
      this.personForm.get('city')!.markAsTouched();
    } catch (error) {
      console.log(error)
    }
  }

  getAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const hasHadBirthdayThisYear = today.getMonth() > birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() > birthDate.getDate());
    if (!hasHadBirthdayThisYear) {
      age--; //Si la persona no cumplio años este año, se le resta uno a la edad
    }
    return age;
  }

  validateDate() {
    const birthDate = new Date(this.personForm.get('birthDate')?.value);
    const today = new Date();
    const age = this.getAge(birthDate);

    if (birthDate > today || age < 18) {
      this.personForm.get('birthDate')?.reset();
      this.personForm.get('birthDate')?.markAsTouched();
    }
  }
}
