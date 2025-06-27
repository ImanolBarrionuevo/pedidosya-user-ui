import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { GlobalStatusService } from '../../services/global-status.service';

@Component({
  standalone: true,
  selector: 'app-template',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './template.component.html',
  styleUrl: './template.component.css',
})
export class TemplateComponent {
  constructor(private globalStatusService: GlobalStatusService) { }

  isLoading(): boolean {
    return this.globalStatusService.isLoading();
  }
}
