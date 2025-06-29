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
  successMsg: string = ''
  errorMsg: string = ''

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.personForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[^0-9]+$/)]],
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
      this.countries = [this.person.city.province.country] //Cargamos countries unicamente con el country de la persona
      this.loadProvinces();
      this.loadCities();
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

  //Función ejecutada al seleccionar un pais distinto
  onCountryChange() {
    //Cargamos las provincias
    this.loadProvinces();

    //Marcamos province como null y como tocada para que salte el validador
    this.personForm.get('province')!.reset(null);
    this.personForm.get('province')!.markAsTouched();

    //Vaciamos el listado de ciudades
    this.cities = [];
    //Marcamos city como null y como tocada para que salte el validador
    this.personForm.get('city')!.reset(null);
    this.personForm.get('city')!.markAsTouched();
  }

  //Función ejecutada al seleccionar una provincia distinta
  onProvinceChange(){
    //Cargamos las ciudades
    this.loadCities()

    //Marcamos city como null y como tocada para que salte el validador
    this.personForm.get('city')!.reset(null);
    this.personForm.get('city')!.markAsTouched();
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

  compareById(option?: Country, selected?: Country): boolean { //Country ya que usamos el name CHEQUEAR
    if(option && selected){
      return option.id === selected.id;
    }
    return option === selected;
}

  async confirmEdit() {
    if (this.personForm.invalid) {
      this.personForm.markAllAsTouched();
      this.errorMsg = 'Incomplete or incorrect information';
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
      this.successMsg = 'Persona editada correctamente';
      setTimeout(() => this.close.emit(), 2000)
    } catch (err) {
      console.error('Algo salió mal', err);
    }
  }

  async validateDate(){
    const currentDate = new Date();
    const selectDate = new Date(await this.personForm.get('birthDate')?.value);
    if(currentDate < selectDate){
      this.personForm.get('birthDate')?.reset();
      this.personForm.get('birthDate')?.markAsTouched();
    }
  }
}
