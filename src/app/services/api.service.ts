import { Injectable } from '@angular/core';
import axios from 'axios';

//Indica que el servicio se proveerá en la raíz de la aplicación.
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  updatePerson(id: number, arg1: { name: any; birthDate: any; email: any; cityId: any; }) {
    throw new Error('Method not implemented.');
  }

  private baseUrlAuth = 'http://localhost:3001/auth'
  private baseUrlPersons = 'http://localhost:3000'
  private accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbWFzQHRvbWFzLmNvbSIsInBlcm1pc3Npb25zIjpbeyJpZCI6MSwiY29kZSI6Ik1PRElGWV9VU0VSIn0seyJpZCI6MiwiY29kZSI6IlJFQURfVVNFUiJ9LHsiaWQiOjMsImNvZGUiOiJERUxFVEVfVVNFUiJ9LHsiaWQiOjQsImNvZGUiOiJDUkVBVEVfUk9MRSJ9LHsiaWQiOjUsImNvZGUiOiJNT0RJRllfUk9MRSJ9LHsiaWQiOjYsImNvZGUiOiJSRUFEX1JPTEUifSx7ImlkIjo3LCJjb2RlIjoiREVMRVRFX1JPTEUifSx7ImlkIjo4LCJjb2RlIjoiQ1JFQVRFX1BFUk1JU1NJT04ifSx7ImlkIjo5LCJjb2RlIjoiTU9ESUZZX1BFUk1JU1NJT04ifSx7ImlkIjoxMCwiY29kZSI6IlJFQURfUEVSTUlTU0lPTiJ9LHsiaWQiOjExLCJjb2RlIjoiREVMRVRFX1BFUk1JU1NJT04ifSx7ImlkIjoxMiwiY29kZSI6IkNSRUFURV9QRVJTT04ifSx7ImlkIjoxMywiY29kZSI6Ik1PRElGWV9QRVJTT04ifSx7ImlkIjoxNCwiY29kZSI6IlJFQURfUEVSU09OIn0seyJpZCI6MTUsImNvZGUiOiJERUxFVEVfUEVSU09OIn0seyJpZCI6MTYsImNvZGUiOiJDUkVBVEVfQ0lUWSJ9LHsiaWQiOjE3LCJjb2RlIjoiTU9ESUZZX0NJVFkifSx7ImlkIjoxOCwiY29kZSI6IlJFQURfQ0lUWSJ9LHsiaWQiOjE5LCJjb2RlIjoiREVMRVRFX0NJVFkifSx7ImlkIjoyMCwiY29kZSI6IkNSRUFURV9QUk9WSU5DRSJ9LHsiaWQiOjIxLCJjb2RlIjoiTU9ESUZZX1BST1ZJTkNFIn0seyJpZCI6MjIsImNvZGUiOiJSRUFEX1BST1ZJTkNFIn0seyJpZCI6MjMsImNvZGUiOiJERUxFVEVfUFJPVklOQ0UifSx7ImlkIjoyNCwiY29kZSI6IkNSRUFURV9DT1VOVFJZIn0seyJpZCI6MjUsImNvZGUiOiJNT0RJRllfQ09VTlRSWSJ9LHsiaWQiOjI2LCJjb2RlIjoiUkVBRF9DT1VOVFJZIn1dLCJpYXQiOjE3NTAyMjgxOTgsImV4cCI6MTc1MDIyOTA5OH0.N2YIzO63L2xBLW0BYxt4haL7UBGxwpMjA-OHt49an1Q'

  constructor() { }

  async login(email: string, password: string) {
    try {
        const data = {email, password}
        const response = await axios.post(this.baseUrlAuth + '/login', data)
        return response.data
    } catch(error){
      throw error;
    }
  }

  async signUp(name:string, surname:string, email:string, password:string) {
    try {
      const data = {name, surname, email, password}
      const response = await axios.post(this.baseUrlAuth + '/register', data)
      return response.data
    } catch(error) {
      throw error;
    }
  }

  //persons.component.ts
  async getPersons(){
    try{
      const response = await axios.get(this.baseUrlPersons + '/person', {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      });
      return response.data
    } catch(error){
      throw error;
    }
  }

  //create-component.ts
  async createPersons(name:string, email:string, birthDate:Date, cityId:number){
    try{
      const data = {name, email, birthDate, cityId}
      const response = await axios.post(this.baseUrlPersons + '/person', data)
      return response.data
    } catch(error) {
      throw error;
    }
  }

  async getCountries(){
    try{
      const response = await axios.get(this.baseUrlPersons + '/country', {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      });
      return response.data
    } catch(error){
      throw error;
    }
  }

  async getProvinces(){
    try{
      const response = await axios.get(this.baseUrlPersons + '/province', {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      });
      return response.data
    } catch(error){
      throw error;
    }
  }

  async getCities(){
    try{
      const response = await axios.get(this.baseUrlPersons + '/city', {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      });
      return response.data
    } catch(error){
      throw error;
    }
  }
}
