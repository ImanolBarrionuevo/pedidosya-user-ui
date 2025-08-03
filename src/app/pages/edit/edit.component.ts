import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Person, City, Province, Country } from '../../interfaces/person-interface';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-edit-person',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnChanges {

  @Input() showEdit = false; // Controla la visibilidad del modal
  @Input() person!: Person; // Persona a editar

  @Output() close = new EventEmitter<void>(); // Evento para cerrar el modal
  @Output() saved = new EventEmitter<Person>(); // Evento para guardar persona editada

  // Propiedades para almacenar datos de países, provincias, ciudades, etc.
  countries: Country[] = [];
  provinces: Province[] = [];
  cities: City[] = [];
  personForm: FormGroup;
  successMsg: string = ''
  errorMsg: string = ''

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.personForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÿ\s]+$/)]],
      birthDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      country: [null, Validators.required],
      province: [null, Validators.required],
      city: [null, Validators.required]
    });
  }

  // Inicializa los datos necesarios al cargar el componente
  ngOnInit() {
    if (this.person) {
      this.patchForm(); // Rellena el formulario con los datos de la persona a editar
      this.countries = [this.person.city.province.country] // Asigna el país de la persona editada
      this.loadProvinces();
      this.loadCities();
    }
  }

  // Detecta cambios en las propiedades de entrada
  ngOnChanges(changes: SimpleChanges) {
    if (changes['person'] && this.person) {
      this.patchForm(); // Rellena el formulario con los datos de la persona a editar si cambia la persona
    }
    if (changes['showEdit']) { // Detecta cambios en la visibilidad del modal
      if (this.showEdit) {
        document.body.classList.add('modal-open'); // Bloquea el scroll mientras el modal está abierto
      } else {
        document.body.classList.remove('modal-open'); // Desbloquea el scroll al cerrar el modal
      }
    }
  }

  // Confirma la edición, valida el formulario y actualiza la persona
  async confirmEdit() {
    if (this.personForm.invalid) {
      this.personForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores
      this.errorMsg = 'Incomplete or incorrect information'; // Mensaje de error si el formulario es inválido
      return;
    }

    const { name, birthDate, email, city } = this.personForm.value; // Extrae los valores del formulario, incluyendo el ID de la ciudad seleccionada
    try {
      const updated = await this.apiService.updatePerson(this.person.id, { // Llama a updatePerson y recibe el Person actualizado
        name,
        birthDate,
        email,
        city: city.id
      });
      this.saved.emit(updated);
      this.errorMsg = ''
      this.successMsg = 'Person successfully updated'; // Mensaje de éxito al actualizar la persona
      setTimeout(() => {
        document.body.classList.remove('modal-open'); // Desbloquea el scroll
        this.close.emit(); // Cierra el modal
      }, 2000);

    } catch (err) {
      console.error('Algo salió mal', err);
    }
  }

  // Cierra el modal y emite el evento de cierre
  closeEdit() {
    this.close.emit();
    document.body.classList.remove('modal-open'); // Desbloquea el scroll al cerrar el modal
  }

  // Carga los países disponibles al iniciar el componente
  async loadCountries() {
    try {
      this.countries = await this.apiService.getCountries()
    } catch (error) {
      console.log(error)
    }
  }

  // Carga las provincias del país seleccionado
  async loadProvinces() {
    try {
      this.personForm.get('city')?.disable(); // Deshabilita el campo de ciudad al cambiar de país
      const selectedCountry = this.personForm.get('country')?.value; // Obtiene el país seleccionado y sus provincias
      this.provinces = await this.apiService.getProvincesByCountry(selectedCountry.id)
    } catch (error) {
      console.log(error)
    }
  }

  // Carga las ciudades de la provincia seleccionada
  async loadCities() {
    try {
      this.personForm.get('city')?.enable(); // Habilita el campo de ciudad al seleccionar una provincia
      const selectedProvince = this.personForm.get('province')?.value; // Obtiene la provincia seleccionada y sus ciudades
      this.cities = await this.apiService.getCitiesByProvince(selectedProvince.id)
    } catch (error) {
      console.log(error)
    }
  }

  // Rellena el formulario con los datos de la persona a editar
  private patchForm() {
    this.personForm.patchValue({
      name: this.person.name,
      birthDate: this.person.birthDate,
      email: this.person.email,
      country: this.person.city.province.country,
      province: this.person.city.province,
      city: this.person.city
    });
  }

  // Resetea el campo indicado y lo marca como tocado para activar el validador
  private resetAndTouchField(field: string) {
    this.personForm.get(field)!.reset(null);
    this.personForm.get(field)!.markAsTouched();
  }

  // Compara dos países por ID para la selección en el formulario
  compareById(option?: Country, selected?: Country): boolean {
    if (option && selected) {
      return option.id === selected.id;
    }
    return option === selected;
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

  //Función ejecutada al seleccionar un país distinto
  onCountryChange() {
    this.loadProvinces(); // Carga las provincias del país seleccionado
    this.resetAndTouchField('province');
    this.cities = [];
    this.resetAndTouchField('city');
  }

  //Función ejecutada al seleccionar una provincia distinta
  onProvinceChange() {
    this.loadCities(); // Carga las ciudades de la provincia seleccionada
    this.resetAndTouchField('city');
  }
}
