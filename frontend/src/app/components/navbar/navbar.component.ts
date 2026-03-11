import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" *ngIf="isLoggedIn">
      <div class="nav-left">
        <div class="nav-brand" routerLink="/dashboard">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#6366f1"/>
            <path d="M12 20h16M20 12v16" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
          <span>JobTracker</span>
        </div>
        <div class="nav-links">
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/applications" routerLinkActive="active">Applications</a>
          <a routerLink="/add" routerLinkActive="active">+ New</a>
        </div>
      </div>
      <div class="nav-right">
        <span class="user-name">{{ currentUser }}</span>
        <button class="btn-logout" (click)="logout()">Logout</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 28px;
      height: 60px;
      background: rgba(15, 15, 35, 0.95);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      backdrop-filter: blur(20px);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-left { display: flex; align-items: center; gap: 32px; }
    .nav-brand {
      display: flex; align-items: center; gap: 10px;
      cursor: pointer; text-decoration: none;
    }
    .nav-brand span {
      font-size: 18px; font-weight: 700; color: #e2e8f0;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }
    .nav-links { display: flex; gap: 4px; }
    .nav-links a {
      color: #94a3b8; text-decoration: none; padding: 8px 16px;
      border-radius: 8px; font-size: 14px; font-weight: 500;
      transition: all 0.2s;
    }
    .nav-links a:hover { color: #e2e8f0; background: rgba(255,255,255,0.05); }
    .nav-links a.active { color: #a5b4fc; background: rgba(99, 102, 241, 0.15); }
    .nav-right { display: flex; align-items: center; gap: 16px; }
    .user-name { color: #94a3b8; font-size: 13px; }
    .btn-logout {
      padding: 7px 16px; background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
      color: #e2e8f0; font-size: 13px; cursor: pointer;
      transition: all 0.2s;
    }
    .btn-logout:hover { background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.4); }
  `]
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  currentUser = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(val => this.isLoggedIn = val);
    this.authService.currentUser$.subscribe(val => this.currentUser = val);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
