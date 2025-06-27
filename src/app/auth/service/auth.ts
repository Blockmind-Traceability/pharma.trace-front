import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  loggedIn$ = this.loggedIn.asObservable();

  constructor() {}

  private hasToken(): boolean {
    if (typeof window !== 'undefined') {
      return !!sessionStorage.getItem('access_token');
    }
    return false;
  }

  login(userData: any): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('access_token', userData.access);
      sessionStorage.setItem('refresh_token', userData.refresh);
      sessionStorage.setItem('user_id', userData.id?.toString() ?? '');
      sessionStorage.setItem('username', userData.username ?? '');
      sessionStorage.setItem('email', userData.email ?? '');
      sessionStorage.setItem('role', userData.role ?? '');
    }
    this.loggedIn.next(true);
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
    }
    this.loggedIn.next(false);
  }
}
