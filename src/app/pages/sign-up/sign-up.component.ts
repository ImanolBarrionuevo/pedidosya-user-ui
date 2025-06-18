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

  public signUpForm!: FormGroup

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiService
  ) { }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  async ngOnInit(){
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }

  async getDataSignUp(){
    if(this.signUpForm.invalid){
      return; //Si es invalido que deberiamos retornar? Mostrar error en la ui??
    }
    try{
      const {name, surname, email, password} = this.signUpForm.value;
      await this.apiService.signUp(name,surname,email,password);
      await this.router.navigate(['/persons']);
    } catch {
      console.error("Fallo che"); //Que error debemos poner?
    }
  }
}
