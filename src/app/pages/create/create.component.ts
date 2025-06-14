import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create.component',
  imports: [],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  constructor(private router: Router) { }

  cancelCreate() {
    this.router.navigate(['/persons']);
  }

  confirmCreate() {
    this.router.navigate(['/persons']);
  }

}
