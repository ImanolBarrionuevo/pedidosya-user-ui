import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-sign-up.component',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})

export class SignUpComponent {

  public signUpForm!: FormGroup // Formulario para el registro de usuario

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiService
  ) { }

  errorMsg: string = '' // Mensaje de error para mostrar al usuario

  // Método para inicializar el formulario y establecer las validaciones
  async ngOnInit() {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[^0-9]+$/)]],
      surname: ['', [Validators.required, Validators.pattern(/^[^0-9]+$/)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    })
  }

  // Método para navegar a la página login
  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Método para manejar el registro de usuario
  async getDataSignUp() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores de validación
      this.errorMsg = 'Incomplete or incorrect information';
    }
    try {
      const { name, surname, email, password } = this.signUpForm.value; // Obtiene los valores del formulario
      await this.apiService.signUp(name, surname, email, password); // Llama al servicio para registrar al usuario
      await this.router.navigate(['/login']); // Navega a home después del registro exitoso
    } catch (error) {
      console.error("Algo salió mal", error);
    }
  }
}
