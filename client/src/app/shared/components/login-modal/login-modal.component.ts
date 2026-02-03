import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { AdminAuthService } from '../../../auth/admin-auth.service';
import { Router } from '@angular/router';
import { LoginModalService } from '../../../core/services/login-modal.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';

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
  registerConfirmPassword = '';

  // ADMIN LOGIN
  showAdminButton = false;
  isAdminMode = false;
  adminEmail = '';
  adminPassword = '';

  loading = false;
  errorMsg = '';
  isOpen = false;

  // Secret tap counter for mobile
  private tapCount = 0;
  private tapTimeout: any;

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

    // Reveal admin login button with Shift + A (for desktop/keyboard)
    this.keyListener = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === 'A') {
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
    
    if (this.tapTimeout) {
      clearTimeout(this.tapTimeout);
    }
  }

  // Secret tap function for mobile/tablet (5 quick taps)
  onSecretTap() {
    this.tapCount++;

    // Clear the previous timeout
    if (this.tapTimeout) {
      clearTimeout(this.tapTimeout);
    }

    // If 5 taps within 4 seconds, reveal admin button
    if (this.tapCount >= 5) {
      this.showAdminButton = true;
      this.tapCount = 0;
      return;
    }

    // Reset tap count after 4 seconds of inactivity
    this.tapTimeout = setTimeout(() => {
      this.tapCount = 0;
    }, 4000);
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
        window.location.href = environment.adminUrl + '/dashboard';
      },
      error: (err) => {
        // Check if this is the CORS error (which means auth succeeded but redirect was blocked)
        if (err.status === 0 && err.statusText === 'Unknown Error') {
          // The login actually succeeded! The backend tried to redirect but CORS blocked it.
          // So we manually redirect here
          console.log('Login successful - redirecting to admin dashboard');
          this.closeModal();
          window.location.href = environment.adminUrl + '/dashboard';
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
        const role = this.auth.getRole();

        this.closeModal();

        if (role === 'ADMIN') {
          window.location.href = environment.adminUrl;
        } else {
          this.router.navigate(['/home']);
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
    if (!this.registerFullName || !this.registerEmail || !this.registerPassword || !this.registerConfirmPassword) {
      this.errorMsg = 'Please fill in all fields.';
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.errorMsg = 'Passwords do not match.';
      return;
    }

    // Split full name into first and last name
    const nameParts = this.registerFullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    this.loading = true;
    this.errorMsg = '';

    this.auth.register({
      firstName: firstName,
      lastName: lastName,
      email: this.registerEmail,
      password: this.registerPassword
    }).subscribe({
      next: () => {
        this.loading = false;
        // Clear registration form
        this.registerFullName = '';
        this.registerEmail = '';
        this.registerPassword = '';
        this.registerConfirmPassword = '';
        // Switch to login mode
        this.isRegisterMode = false;
        this.errorMsg = 'Registration successful! Please login with your credentials.';
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
    window.location.href = `${environment.apiBaseUrl}/oauth2/authorization/google`;
  }
}
