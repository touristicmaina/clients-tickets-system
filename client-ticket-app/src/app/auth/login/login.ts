import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  login() {
    if (this.username === 'admin' && this.password === 'admin') {
      alert('Login successful');
    } else {
      this.error = 'Invalid credentials';
    }
  }

  forgotPassword() {
    alert('Contact administrator');
  }
}
