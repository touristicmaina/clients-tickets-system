import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-client.html',
  styleUrls: ['./create-client.scss']
})
export class CreateClientComponent {
  client = {
    clientName: '',
    hotel: '',
    room: '',
    phone: '',
    guideName: '',
    guidePhone: ''
  };

  constructor(private router: Router) {}

  save() {
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    clients.push(this.client);
    localStorage.setItem('clients', JSON.stringify(clients));
    this.router.navigate(['/clients']);
  }
}
