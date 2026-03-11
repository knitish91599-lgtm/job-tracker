import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="#6366f1"/>
              <path d="M12 20h16M20 12v16" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <h1>Job Tracker</h1>
          <p>Track your job applications in one place</p>
        </div>

        <div class="tab-switch">
          <button [class.active]="!isRegister" (click)="isRegister = false">Sign In</button>
          <button [class.active]="isRegister" (click)="isRegister = true">Register</button>
        </div>

        <!-- Login Form -->
        <form *ngIf="!isRegister" (ngSubmit)="onLogin()" class="auth-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input id="username" type="text" [(ngModel)]="loginData.username"
                   name="username" placeholder="Enter username" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" [(ngModel)]="loginData.password"
                   name="password" placeholder="Enter password" required>
          </div>
          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <!-- Register Form -->
        <form *ngIf="isRegister" (ngSubmit)="onRegister()" class="auth-form">
          <div class="form-group">
            <label for="regFullname">Full Name</label>
            <input id="regFullname" type="text" [(ngModel)]="registerData.fullName"
                   name="fullName" placeholder="John Doe" required>
          </div>
          <div class="form-group">
            <label for="regEmail">Email</label>
            <input id="regEmail" type="email" [(ngModel)]="registerData.email"
                   name="email" placeholder="john@example.com" required>
          </div>
          <div class="form-group">
            <label for="regUsername">Username</label>
            <input id="regUsername" type="text" [(ngModel)]="registerData.username"
                   name="username" placeholder="Choose a username" required>
          </div>
          <div class="form-group">
            <label for="regPassword">Password</label>
            <input id="regPassword" type="password" [(ngModel)]="registerData.password"
                   name="password" placeholder="Min 6 characters" required>
          </div>
          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <div class="error-message" *ngIf="errorMessage">{{ errorMessage }}</div>
        <div class="success-message" *ngIf="successMessage">{{ successMessage }}</div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%);
      padding: 20px;
    }
    .login-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 40px;
      width: 100%;
      max-width: 420px;
      backdrop-filter: blur(20px);
    }
    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }
    .login-header .logo {
      margin-bottom: 16px;
      display: inline-block;
    }
    .login-header h1 {
      font-family: 'Segoe UI', system-ui, sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: #e2e8f0;
      margin: 0 0 8px;
    }
    .login-header p {
      color: #94a3b8;
      font-size: 14px;
      margin: 0;
    }
    .tab-switch {
      display: flex;
      gap: 0;
      margin-bottom: 28px;
      background: rgba(255,255,255,0.04);
      border-radius: 10px;
      padding: 4px;
    }
    .tab-switch button {
      flex: 1;
      padding: 10px;
      border: none;
      background: transparent;
      color: #94a3b8;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.2s;
    }
    .tab-switch button.active {
      background: #6366f1;
      color: white;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      color: #cbd5e1;
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 6px;
    }
    .form-group input {
      width: 100%;
      padding: 12px 14px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      color: #e2e8f0;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    .form-group input:focus {
      border-color: #6366f1;
    }
    .form-group input::placeholder {
      color: #475569;
    }
    .btn-primary {
      width: 100%;
      padding: 12px;
      background: #6366f1;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 8px;
    }
    .btn-primary:hover { background: #4f46e5; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .error-message {
      text-align: center;
      color: #f87171;
      font-size: 13px;
      margin-top: 16px;
      padding: 10px;
      background: rgba(248, 113, 113, 0.1);
      border-radius: 8px;
    }
    .success-message {
      text-align: center;
      color: #34d399;
      font-size: 13px;
      margin-top: 16px;
      padding: 10px;
      background: rgba(52, 211, 153, 0.1);
      border-radius: 8px;
    }
  `]
})
export class LoginComponent {
  isRegister = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  loginData = { username: '', password: '' };
  registerData = { username: '', password: '', fullName: '', email: '' };

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin() {
    this.loading = true;
    this.errorMessage = '';
    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid credentials';
        this.loading = false;
      }
    });
  }

  onRegister() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.authService.register(this.registerData).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage = 'Account created! You can now sign in.';
          this.isRegister = false;
          this.loginData.username = this.registerData.username;
        } else {
          this.errorMessage = res.message;
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}
