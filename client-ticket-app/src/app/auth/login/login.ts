import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    const success = this.authService.login(this.email, this.password);

    if (success) {
      this.router.navigate(['/']);
    } else {
      this.error = 'Invalid email or password';
    }
  }
}
