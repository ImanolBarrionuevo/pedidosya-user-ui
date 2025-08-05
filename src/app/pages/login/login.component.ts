import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  public loginForm!: FormGroup // Formulario para el inicio de sesión

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,

  ) { }

  errorMsg: string = '' // Mensaje de error para mostrar al usuario

  // Método para inicializar el formulario y establecer las validaciones
  async ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    })
  }

  // Método para navegar a la página sign-up
  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }

  // Método para manejar el inicio de sesión
  async getDataLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores de validación
      this.errorMsg = 'Incomplete or incorrect information';
    }
    try {
      const { email, password } = this.loginForm.value; // Obtiene los valores del formulario
      await this.apiService.login(email, password); // Llama al servicio para iniciar sesión
      await this.router.navigate(['/home']); // Navega a home después del inicio de sesión exitoso
    } catch (e) {
      this.errorMsg = 'Incomplete or incorrect information';
      console.error(e);
    }
  }
}
