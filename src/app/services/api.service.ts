import { Injectable } from '@angular/core';
import { Person } from '../interfaces/person-interface';
import { axiosServicePersons } from './axiosClientPersons';
import { axiosServiceAuth } from './axiosClientAuth';

//Indica que el servicio se proveerá en la raíz de la aplicación.
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor() { }

  async updatePerson(
    id: number,
    payload: {
      name: string;
      email: string;
      birthDate: Date;
      city: number;
    }): Promise<Person> {
    try {
      console.log(id, payload)
      const response = await axiosServicePersons.put<Person>(`/person/${id}`, payload);
      return response.data;
    } catch (error) {
      // opcional: manejar o loguear el error aquí
      throw new Error('No se puede actualizar la persona');
    }
  }

  async login(email: string, password: string) {
    try {
        const data = {email, password}
        const response = await axiosServiceAuth.post('/login', data)
        localStorage.setItem('accessToken', response.data.accessToken)
        return; //Dejamos el return vacio ya que guardamos el accessToken en localStorage
    } catch(error){
      throw new Error('Datos incorrectos o usuario no registrado');
    }
  }

  async signUp(name:string, surname:string, email:string, password:string) {
    try {
      const data = {name, surname, email, password}
      const response = await axiosServiceAuth.post('/register', data)
      return response.data
    } catch(error) {
      throw error;
    }
  }

  //persons.component.ts
  async getPersons(){
    try{
      const response = await axiosServicePersons.get('/person')
      return response.data
    } catch(error){
      throw error;
    }
  }

  //create-component.ts
  async createPersons(name:string, birthDateStr:string, email:string, city:number){ //Recibimos birthDate como string y despues lo transformamos a Date
    try{
      const [year, month, day] = birthDateStr.split('-').map(Number);
      const birthDate = new Date(year, month-1, day);
      const data = {name, email, birthDate, city}
      const response = await axiosServicePersons.post('/person', data)
      return response.data
    } catch(error) {
      throw error;
    }
  }

  async getCountries(){
    try{
      const response = await axiosServicePersons.get('/country');
      return response.data
    } catch(error){
      throw error;
    }
  }

  async getProvinces(){
    try{
      const response = await axiosServicePersons.get('/province');
      return response.data
    } catch(error){
      throw error;
    }
  }

  async getCities(){
    try{
      const response = await axiosServicePersons.get('/city');
      return response.data
    } catch(error){
      throw error;
    }
  }
}
