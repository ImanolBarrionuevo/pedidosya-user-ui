import { Injectable } from '@angular/core';
import axios from 'axios';

//Indica que el servicio se proveerá en la raíz de la aplicación.
@Injectable({
  providedIn: 'root'
})
export class Api {

  private baseUrlAuth = 'http://localhost:3001'
  private baseUrlPersons = 'http://localhost:3000'

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
}
