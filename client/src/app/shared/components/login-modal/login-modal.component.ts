import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { AdminAuthService } from '../../../auth/admin-auth.service';
import { Router } from '@angular/router';
import { LoginModalService } from '../../../core/services/login-modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit, OnDestroy {

  @Output() close = new EventEmitter<void>();

  // USER LOGIN
  email = '';
  password = '';

  // REGISTER
  isRegisterMode = false;
  registerFullName = '';
  registerEmail = '';
  registerPassword = '';

  // ADMIN LOGIN
  showAdminButton = false;
  isAdminMode = false;
  adminEmail = '';
  adminPassword = '';

  loading = false;
  errorMsg = '';
  isOpen = false;

  private modalSubscription!: Subscription;
  private keyListener!: (event: KeyboardEvent) => void;

  constructor(
    private auth: AuthService,
    private adminAuth: AdminAuthService,
    private router: Router,
    private loginModalService: LoginModalService
  ) {}

  ngOnInit() {
    // Track modal open/close state
    this.modalSubscription = this.loginModalService.isOpen$.subscribe(open => {
      this.isOpen = open;
    });

    // Reveal admin login button with Shift + A
    this.keyListener = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'a' && event.shiftKey) {
        this.showAdminButton = true;
      }
    };

    window.addEventListener('keydown', this.keyListener);
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
    window.removeEventListener('keydown', this.keyListener);
  }

  // Close modal
  closeModal() {
    this.loginModalService.close();
    this.close.emit();
  }

  // Register toggle
  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMsg = '';
  }

  // Admin mode controls
  enableAdminMode() {
    this.isAdminMode = true;
    this.errorMsg = '';
  }

  disableAdminMode() {
    this.isAdminMode = false;
    this.errorMsg = '';
  }

  // ---------------- ADMIN LOGIN ----------------
    adminLogin() {
    if (!this.adminEmail || !this.adminPassword) {
      this.errorMsg = 'Please enter both admin email and password.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.adminAuth.login({
      email: this.adminEmail,
      password: this.adminPassword
    }).subscribe({
      next: (response: any) => {
        // Success - redirect to admin dashboard
        this.closeModal();
        window.location.href = 'http://localhost:4300/dashboard';
      },
      error: (err) => {
        // Check if this is the CORS error (which means auth succeeded but redirect was blocked)
        if (err.status === 0 && err.statusText === 'Unknown Error') {
          // The login actually succeeded! The backend tried to redirect but CORS blocked it.
          // So we manually redirect here
          console.log('Login successful - redirecting to admin dashboard');
          this.closeModal();
          window.location.href = 'http://localhost:4300/dashboard';
        } else {
          // Actual login failure
          this.loading = false;
          this.errorMsg = 'Admin login failed. Please try again.';
          console.error('Admin login error:', err);
        }
      }
    });
  }

  // ---------------- USER LOGIN ----------------
  login() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Please enter both email and password.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        this.auth.storeToken(res.token);
        const role = this.auth.getRole();

        this.closeModal();

        if (role === 'ADMIN') {
          window.location.href = 'http://localhost:4300';
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg =
          err.status === 401
            ? 'Invalid email or password.'
            : 'Login failed.';
      }
    });
  }

  // ---------------- REGISTER ----------------
  register() {
    if (!this.registerFullName || !this.registerEmail || !this.registerPassword) {
      this.errorMsg = 'Please fill in all fields.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.auth.register({
      fullName: this.registerFullName,
      email: this.registerEmail,
      password: this.registerPassword
    }).subscribe({
      next: () => {
        this.auth.login(this.registerEmail, this.registerPassword).subscribe({
          next: (loginRes: any) => {
            this.auth.storeToken(loginRes.token);
            this.closeModal();
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.loading = false;
            this.errorMsg = 'Registration succeeded, but auto-login failed.';
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg =
          err.status === 409
            ? 'Email already in use.'
            : 'Registration failed.';
      }
    });
  }

  googleLogin() {
    window.location.href = 'http://localhost:8200/oauth2/authorization/google';
  }
}