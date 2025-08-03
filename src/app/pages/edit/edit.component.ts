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
  @Input() showEdit = false;
  @Input() person!: Person;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Person>();

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
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]], //Verificamos que sea un email valido
      country: [null, Validators.required],
      province: [null, Validators.required],
      city: [null, Validators.required]
    });
  }

  ngOnInit() {
    // Si ya trae persona, parchea form
    if (this.person) {
      this.patchForm();
      this.countries = [this.person.city.province.country] // Cargamos countries unicamente con el country de la persona
      this.loadProvinces();
      this.loadCities();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['person'] && this.person) {
      this.patchForm();
    }
    if (changes['showEdit']) { // Esta parte sirve para bloquear el scroll mientras el edit está abierto
      if (this.showEdit) {
        document.body.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open');
      }
    }
  }

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

  //Función ejecutada al seleccionar un país distinto
  onCountryChange() {
    this.loadProvinces(); // Carga las provincias del país seleccionado
    this.resetAndTouchField('province');
    this.cities = []; // Limpia las ciudades ya que el país cambió
    this.resetAndTouchField('city');
  }

  //Función ejecutada al seleccionar una provincia distinta
  onProvinceChange() {
    this.loadCities(); // Carga las ciudades de la provincia seleccionada
    this.resetAndTouchField('city');
  }

  async loadCountries() {
    try {
      this.countries = await this.apiService.getCountries()
    } catch (error) {
      console.log(error)
    }
  }

  async loadProvinces() {
    try {
      // Bloqueamos la selección de city mientras no haya una selección de province
      this.personForm.get('city')?.disable();
      const selectedCountry = this.personForm.get('country')?.value;
      this.provinces = await this.apiService.getProvincesByCountry(selectedCountry.id)
    } catch (error) {
      console.log(error)
    }
  }

  async loadCities() {
    try {
      this.personForm.get('city')?.enable();
      const selectedProvince = this.personForm.get('province')?.value;
      this.cities = await this.apiService.getCitiesByProvince(selectedProvince.id)
    } catch (error) {
      console.log(error)
    }
  }

  closeEdit() {
    this.close.emit();
    document.body.classList.remove('modal-open');
  }

  compareById(option?: Country, selected?: Country): boolean { //Country ya que usamos el name CHEQUEAR
    if (option && selected) {
      return option.id === selected.id;
    }
    return option === selected;
  }

  async confirmEdit() {
    if (this.personForm.invalid) {
      this.personForm.markAllAsTouched();
      this.errorMsg = 'Incomplete or incorrect information';
      return;
    }

    const { name, birthDate, email, city } = this.personForm.value;
    try {
      // Llama a updatePerson y recibe el Person actualizado
      const updated = await this.apiService.updatePerson(this.person.id, {
        name,
        birthDate,
        email,
        city: city.id
      });
      this.saved.emit(updated);
      this.errorMsg = ''
      this.successMsg = 'Person successfully updated';
      setTimeout(() => {
        document.body.classList.remove('modal-open');
        this.close.emit();
      }, 2000);

    } catch (err) {
      console.error('Algo salió mal', err);
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
