import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  // دالة تسجيل الدخول التي يطلبها ملف login.ts
  login(username: string, password: string): boolean {
    let role = '';
    if (username === 'admin' && password === 'admin') role = 'admin';
    else if (username === 'user' && password === 'user') role = 'user';

    if (role) {
      localStorage.setItem('user', JSON.stringify({ username, role }));
      return true;
    }
    return false;
  }

  // دالة التحقق من تسجيل الدخول التي يطلبها auth.guard.ts
  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  getRole(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role || '';
  }

  getUserName(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.username || 'unknown';
  }

  logout() {
    localStorage.removeItem('user');
  }
}
