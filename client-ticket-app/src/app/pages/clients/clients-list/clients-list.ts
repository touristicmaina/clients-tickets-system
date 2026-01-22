import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clients-list.html',
  styleUrls: ['./clients-list.scss']
})
export class ClientsListComponent implements OnInit {
  clients: any[] = [];

  ngOnInit() {
    this.clients = JSON.parse(localStorage.getItem('clients') || '[]');
  }
}
