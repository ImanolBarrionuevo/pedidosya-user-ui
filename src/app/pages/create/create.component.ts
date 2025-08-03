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

  private _showCreate = false; // Controla la visibilidad del modal

  @Input() set showCreate(value: boolean) {
    if (this._showCreate === value) return;
    this._showCreate = value;
    if (this._showCreate) {
      document.body.classList.add('modal-open'); // Bloquea el scroll mientras el modal está abierto
      setTimeout(() => {
        const modalContainer = document.querySelector('.modal-container') as HTMLElement;
        if (modalContainer && !modalContainer.classList.contains('active')) {
          modalContainer.classList.add('active'); // Activa la clase para mostrar el modal
        }
      }, 50);
    } else {
      document.body.classList.remove('modal-open'); // Libera el scroll cuando el modal se cierra
    }
  }

  @Output() close = new EventEmitter<void>(); // Evento para cerrar el modal
  @Output() saved = new EventEmitter<Person>(); // Evento para guardar persona creada

  // Getter para acceder al estado de visibilidad del modal
  get showCreate(): boolean {
    return this._showCreate;
  }

  // Propiedades para almacenar datos de países, provincias, ciudades, etc.
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

  // Inicializa los datos necesarios al cargar el componente
  ngOnInit() {
    this.personForm.get('province')?.disable(); // Deshabilita los campos de provincia y ciudad
    this.personForm.get('city')?.disable();
    this.getCountries() // Carga los países
  }

  // Crea una nueva persona con los datos del formulario
  async createPerson() {
    if (this.personForm.invalid) {
      this.personForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores de validación
      this.errorMsg = 'Incomplete or incorrect information'
      return;
    }
    try {
      const { name, birthDate, email, city } = this.personForm.value; // Obtiene los valores del formulario
      const newPerson = await this.apiService.createPersons(name, birthDate, email, city.id);
      this.saved.emit(newPerson)
      this.errorMsg = ''
      this.successMsg = 'Person successfully created'; // Mensaje de éxito al crear la persona
      setTimeout(() => {
        document.body.classList.remove('modal-open'); // Desbloquea el scroll al cerrar el modal
        this.close.emit(); // Cierra el modal
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  }

  // Cierra el modal y emite el evento de cierre
  closeCreate() {
    this.close.emit();
    document.body.classList.remove('modal-open'); // Desbloquea el scroll al cerrar el modal
  }

  // Carga los países disponibles al iniciar el componente
  async getCountries() {
    try {
      this.countries = await this.apiService.getCountries()
    } catch (error) {
      console.log(error)
    }
  }

  // Carga las provincias del país seleccionado
  async getProvinces() {
    try {
      this.cities = []
      this.personForm.get('city')?.disable(); // Deshabilita el campo de ciudad y habilita el campo de provincia
      this.personForm.get('province')?.enable();
      const selectedCountry = this.personForm.get('country')?.value; // Obtiene el país seleccionado y sus provincias
      this.provinces = await this.apiService.getProvincesByCountry(selectedCountry.id)
      this.personForm.get('province')!.reset(null); // Resetea el campo de provincia
      this.personForm.get('province')!.markAsTouched(); // Marca el campo como tocado para mostrar errores si es necesario
    } catch (error) {
      console.error('Algo salió mal', error)
    }
  }

  // Carga las ciudades de la provincia seleccionada
  async getCities() {
    try {
      const selectedProvince = this.personForm.get('province')?.value; // Obtiene la provincia seleccionada
      this.personForm.get('city')?.enable(); // Habilita el campo de ciudad
      this.cities = await this.apiService.getCitiesByProvince(selectedProvince.id) // Obtiene las ciudades de la provincia seleccionada
      this.personForm.get('city')!.reset(null); // Resetea el campo de ciudad
      this.personForm.get('city')!.markAsTouched(); // Marca el campo como tocado para mostrar errores si es necesario
    } catch (error) {
      console.log(error)
    }
  }

  // Calcula la edad a partir de la fecha de nacimiento
  getAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const hasHadBirthdayThisYear = today.getMonth() > birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() > birthDate.getDate());
    if (!hasHadBirthdayThisYear) {
      age--; //Si la persona no cumplio años este año, se le resta uno a la edad
    }
    return age;
  }

  // Valida la fecha de nacimiento para asegurarse de que sea válida y la persona tenga al menos 18 años
  validateDate() {
    const birthDate = new Date(this.personForm.get('birthDate')!.value);
    const today = new Date();
    const age = this.getAge(birthDate);

    if (birthDate > today || age < 18) {
      this.personForm.get('birthDate')!.reset();
      this.personForm.get('birthDate')!.markAsTouched();
    }
  }
}
