import { Component, OnInit } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import { Router } from '@angular/router';
import {AuthService} from '../../auth/service/auth';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink
  ],
  templateUrl: './header.html',
  standalone: true,
  styleUrl: './header.css'
})
export class Header implements OnInit {
  isLoggedIn = false;
  username: string | null = null;
  role: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.loggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        if (typeof window !== 'undefined') {
          this.username = sessionStorage.getItem('username');
          this.role = sessionStorage.getItem('role');
        }
      } else {
        this.username = null;
        this.role = null;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
