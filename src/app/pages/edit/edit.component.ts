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

  countries: Country[]  = [];
  provinces: Province[] = [];
  cities: City[]        = [];

  personForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.personForm = this.fb.group({
      name: ['', Validators.required],
      birthDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: [null, Validators.required],
      province: [null, Validators.required],
      city: [null, Validators.required]
    });
  }

  ngOnInit() {
    // Cargo selects al iniciar
    this.loadCountries();
    this.loadProvinces();
    this.loadCities();

    // Si ya trae persona, parchea form
    if (this.person) {
      this.patchForm();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['person'] && this.person) {
      this.patchForm();
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

  // Con algo de esto vamos a poder traer datos de la bd
  async loadCountries() {
    try {
      this.countries = await this.apiService.getCountries()
    } catch (error) {
      console.log(error)
    }
  }
  async loadProvinces() {
    try {
      const selectedCountry = this.personForm.get('country')?.value;
      this.provinces = await this.apiService.getProvincesByCountry(selectedCountry.id)
    } catch (error) {
      console.log(error)
    }
  }
  async loadCities() {
    try {
      const selectedProvince = this.personForm.get('province')?.value;
      this.cities = await this.apiService.getCitiesByProvince(selectedProvince.id)
    } catch (error) {
      console.log(error)
    }
  }

  closeEdit() {
    this.close.emit();
  }

  async confirmEdit() {
    if (this.personForm.invalid) {
      this.personForm.markAllAsTouched();
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
      this.close.emit();
    } catch (err) {
      console.error('Algo salió mal', err);
    }
  }
}
