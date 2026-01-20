import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;
  private role: 'admin' | 'user' = 'user';

  login(email: string, password: string): boolean {
    if (email === 'admin@test.com' && password === '1234') {
      this.loggedIn = true;
      this.role = 'admin';
      return true;
    }

    if (email === 'user@test.com' && password === '1234') {
      this.loggedIn = true;
      this.role = 'user';
      return true;
    }

    return false;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getRole(): string {
    return this.role;
  }

  logout() {
    this.loggedIn = false;
  }
}
