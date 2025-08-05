/**
 * Servicio API centralizado para gestionar todas las peticiones HTTP de la aplicación.
 * Incluye métodos para autenticación, registro, CRUD de personas y obtención de datos de países, provincias y ciudades.
 */

import { Injectable } from '@angular/core';
import { City, Person, Province } from '../interfaces/person-interface';
import { axiosServicePersons } from './axiosClientPersons';
import { axiosServiceAuth } from './axiosClientAuth';
import { MOCK_FOOD } from '../mocks/mock-food';

@Injectable({
  providedIn: 'root' // Indica que el servicio se proveerá en la raíz de la aplicación.
})
export class ApiService {

  constructor() { }

  // Método simulado para obtener datos de comida (mock)
  async getData(): Promise<typeof MOCK_FOOD> {
    return MOCK_FOOD;
  }

  // Actualiza una persona existente por su ID
  async updatePerson(id: number, payload: {
    name: string;
    email: string;
    birthDate: Date;
    city: number;
  }): Promise<Person> {
    try {
      const response = await axiosServicePersons.put<Person>(`/person/${id}`, payload);
      return response.data; // Devuelve la persona actualizada
    } catch (error) {
      throw new Error('No se puede actualizar la persona');
    }
  }

  // Inicia sesión con email y contraseña y guarda el token de acceso
  async login(email: string, password: string) {
    try {
      const data = { email, password }
      const response = await axiosServiceAuth.post('/login', data)
      localStorage.setItem('accessToken', response.data.accessToken) // Guarda el token en localStorage
      return;
    } catch (error) {
      throw new Error('Datos incorrectos o usuario no registrado');
    }
  }

  // Registra un nuevo usuario con los datos proporcionados
  async signUp(name: string, surname: string, email: string, password: string) {
    try {
      const data = { name, surname, email, password }
      const response = await axiosServiceAuth.post('/register', data)
      return response.data // Devuelve los datos del usuario registrado
    } catch (error) {
      throw error;
    }
  }

  // Obtiene la lista de personas desde la API
  async getPersons() {
    try {
      const response = await axiosServicePersons.get('/person')
      return response.data // Devuelve el array de personas
    } catch (error) {
      throw error;
    }
  }

  // Crea una nueva persona con los datos proporcionados
  async createPersons(name: string, birthDateStr: string, email: string, city: number) {
    try {
      const [year, month, day] = birthDateStr.split('-').map(Number); // Recibe birthDate como string y luego se transforma a Date
      const birthDate = new Date(year, month - 1, day);
      const data = { name, email, birthDate, city }
      const response = await axiosServicePersons.post('/person', data) // Envía la petición POST a la API
      return response.data // Devuelve la persona creada
    } catch (error) {
      throw error;
    }
  }

  // Obtiene la lista de países desde la API
  async getCountries() {
    try {
      const response = await axiosServicePersons.get('/country');
      return response.data // Devuelve el array de países
    } catch (error) {
      throw error;
    }
  }

  // Obtiene la lista de provincias filtradas por el ID del país
  async getProvincesByCountry(idCountry: number) {
    try {
      const response = await axiosServicePersons.get('/province'); // Obtiene todas las provincias
      const allProvinces: Province[] = response.data
      const responseFilter = allProvinces.filter(province => province.country.id === idCountry) // Filtra las provincias por el ID del país
      return responseFilter // Devuelve las provincias filtradas
    } catch (error) {
      throw error;
    }
  }

  // Obtiene la lista de ciudades filtradas por el ID de la provincia
  async getCitiesByProvince(idProvince: number) {
    try {
      const response = await axiosServicePersons.get('/city'); // Obtiene todas las ciudades
      const allCities: City[] = response.data
      const responseFilter = allCities.filter((city) => city.province.id === idProvince) // Filtra las ciudades por el ID de la provincia
      return responseFilter // Devuelve las ciudades filtradas
    } catch (error) {
      throw error;
    }
  }
}
