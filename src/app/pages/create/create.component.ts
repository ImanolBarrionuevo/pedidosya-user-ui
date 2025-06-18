import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { City, Country, Province } from '../../interfaces/person-interface';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

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
  cities: City[] = [];
  countries: Country[] = [];
  provinces: Province[] = [];


  // 🔹 Listas de opciones para los selects
  // Tenemos que hacer que se importen de la BD
  //countries = ['Argentina', 'Brazil', 'Chile', 'Uruguay'];
  //provinces = ['Buenos Aires', 'Córdoba', 'Santa Fe'];
  //cities = ['Villa Nueva', 'Córdoba', 'Rosario'];


  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
    ){
      this.personForm = this.fb.group({
        name: ['', Validators.required],
        surname: ['', Validators.required],
        city: ['', Validators.required],
        province: ['', Validators.required],
        country: ['', Validators.required]
      })
    }
  

  closeCreate() {
    this.close.emit(); // Notifica a `PersonsComponent` que se cerró el modal
  }

  confirmCreate() {
    this.close.emit(); // Cierra el modal después de crear la persona
  }

  ngOnInit(){
    this.getCountries(),
    this.getProvinces(),
    this.getCities()
  }

  async createPerson(){
    if(this.personForm.invalid){
      return; //Si es invalido que deberiamos retornar? Mostrar error en la ui??
    }
    try{
      const {name, surname, email, city} = this.personForm.value; //Deberia ir birtDate en vez de surname y verificar como sacar id de city
      await this.apiService.createPersons(name,surname,email,city);
      await this.router.navigate(['/persons']);
    } catch {
      console.error("Fallo che"); //Que error debemos poner?
    }
  }

  async getCountries(){
    try{
      this.countries = await this.apiService.getCountries()
    } catch(error){
      console.log(error)
    }
  }

  async getProvinces(){
    try{
      this.provinces = await this.apiService.getProvinces()
    } catch(error){
      console.log(error)
    }
  }

  async getCities(){
    try{
      this.cities = await this.apiService.getCities()
    } catch(error){
      console.log(error)
    }
  }
}

