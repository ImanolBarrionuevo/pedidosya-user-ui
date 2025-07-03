import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule], //Preguntar si no deberia importarse en un app.module
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public loginForm!: FormGroup

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,

  ) { }

  errorMsg: string = ''

  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }

  async ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    })
  }

  async getDataLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMsg = 'Incomplete or incorrect information';
    }
    try {
      const { email, password } = this.loginForm.value
      await this.apiService.login(email, password)
      await this.router.navigate(['/home'])
    } catch (e) {
      this.errorMsg = 'Incomplete or incorrect information';
      console.error(e);
    }
  }
}
