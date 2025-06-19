import { Injectable } from '@angular/core';
import axios from 'axios';
import { Person } from '../interfaces/person-interface';
import { axiosServicePersons } from './axiosClientPersons';
import { axiosServiceAuth } from './axiosClientAuth';

//Indica que el servicio se proveerá en la raíz de la aplicación.
@Injectable({
  providedIn: 'root'
})
export class ApiService {


  //private baseUrlAuth = 'http://localhost:3001/auth'
  //private baseUrlPersons = 'http://localhost:3000'
  //private accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdhYmlAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOlt7ImlkIjoxLCJjb2RlIjoiQ1JFQVRFX1VTRVIifSx7ImlkIjoyLCJjb2RlIjoiTU9ESUZZX1VTRVIifSx7ImlkIjozLCJjb2RlIjoiUkVBRF9VU0VSIn0seyJpZCI6NCwiY29kZSI6IkNSRUFURV9QUlVFQkEifSx7ImlkIjo1LCJjb2RlIjoiQ1JFQVRFX1JPTEUifSx7ImlkIjo2LCJjb2RlIjoiTU9ESUZZX1JPTEUifSx7ImlkIjo3LCJjb2RlIjoiUkVBRF9ST0xFIn0seyJpZCI6OCwiY29kZSI6IkRFTEVURV9ST0xFIn0seyJpZCI6OSwiY29kZSI6IkNSRUFURV9QRVJNSVNTSU9OIn0seyJpZCI6MTAsImNvZGUiOiJNT0RJRllfUEVSTUlTU0lPTiJ9LHsiaWQiOjExLCJjb2RlIjoiUkVBRF9QRVJNSVNTSU9OIn0seyJpZCI6MTIsImNvZGUiOiJERUxFVEVfUEVSTUlTU0lPTiJ9LHsiaWQiOjEzLCJjb2RlIjoiQ1JFQVRFX1BFUlNPTiJ9LHsiaWQiOjE0LCJjb2RlIjoiTU9ESUZZX1BFUlNPTiJ9LHsiaWQiOjE1LCJjb2RlIjoiUkVBRF9QRVJTT04ifSx7ImlkIjoxNiwiY29kZSI6IkRFTEVURV9QRVJTT04ifSx7ImlkIjoxNywiY29kZSI6IkNSRUFURV9DSVRZIn0seyJpZCI6MTgsImNvZGUiOiJNT0RJRllfQ0lUWSJ9LHsiaWQiOjE5LCJjb2RlIjoiUkVBRF9DSVRZIn0seyJpZCI6MjAsImNvZGUiOiJERUxFVEVfQ0lUWSJ9LHsiaWQiOjIxLCJjb2RlIjoiQ1JFQVRFX1BST1ZJTkNFIn0seyJpZCI6MjIsImNvZGUiOiJNT0RJRllfUFJPVklOQ0UifSx7ImlkIjoyMywiY29kZSI6IlJFQURfUFJPVklOQ0UifSx7ImlkIjoyNCwiY29kZSI6IkRFTEVURV9QUk9WSU5DRSJ9LHsiaWQiOjI1LCJjb2RlIjoiQ1JFQVRFX0NPVU5UUlkifSx7ImlkIjoyNiwiY29kZSI6Ik1PRElGWV9DT1VOVFJZIn0seyJpZCI6MjcsImNvZGUiOiJSRUFEX0NPVU5UUlkifV0sImlhdCI6MTc1MDM1NTY4MiwiZXhwIjoxNzUwMzU2NTgyfQ.BuXLT1EunVVi88gyM33sTCX3RlJKE9oymTLL8Ufb-UU'
  
  constructor() { }

  async updatePerson(
    id: number,
    payload: {
      name: string;
      email: string;
      birthDate: Date;
      cityId: number;
    }): Promise<Person> {
    try {
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
        return response.data //Retornamos la data o simplemente dejamos un return?
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
  async createPersons(name:string, email:string, birthDate:Date, cityId:number){
    try{
      const data = {name, email, birthDate, cityId}
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
