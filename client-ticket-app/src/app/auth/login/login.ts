import { RouterModule } from "@angular/router";
import { Router } from "@angular/router";
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  constructor(private router: Router) {}
  username = '';
  password = '';
  error = '';

  login() {
    if (this.username === 'admin' && this.password === 'admin') {
      this.router.navigate(["/dashboard"]);
    } else {
      this.error = 'Invalid credentials';
    }
  }

  forgotPassword() {
    alert('Contact administrator');
  }
}
