import { Injectable } from '@angular/core';

export type UserRole = 'admin' | 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: { username: string; role: UserRole } | null = null;

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin123') {
      this.user = { username, role: 'admin' };
      return true;
    }

    if (username === 'user' && password === 'user123') {
      this.user = { username, role: 'user' };
      return true;
    }

    return false;
  }

  logout() {
    this.user = null;
  }

  isLoggedIn(): boolean {
    return this.user !== null;
  }

  getRole(): UserRole | null {
    return this.user?.role ?? null;
  }
}
