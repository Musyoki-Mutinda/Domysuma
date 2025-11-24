import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { AdminAuthService } from '../../../auth/admin-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {

  @Output() close = new EventEmitter<void>();

  // ---------------- LOGIN FORM ----------------
  email = '';
  password = '';

  // ---------------- REGISTER FORM ----------------
  isRegisterMode = false;
  registerFullName = '';
  registerEmail = '';
  registerPassword = '';

  // ---------------- ADMIN LOGIN FORM ----------------
  showAdminButton = false;   // Hidden until Shift + A
  isAdminMode = false;       // Toggles admin UI
  adminEmail = '';
  adminPassword = '';

  loading = false;
  errorMsg = '';

  constructor(
    private auth: AuthService,
    private adminAuth: AdminAuthService,   // <-- ADDED
    private router: Router
  ) {}

  ngOnInit() {
    window.addEventListener('keydown', (event) => {
      if (event.key === 'A' && event.shiftKey) {
        this.showAdminButton = true;
      }
    });
  }

  closeModal() {
    this.close.emit();
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMsg = '';
  }

  enableAdminMode() {
    this.isAdminMode = true;
    this.errorMsg = '';
  }

  disableAdminMode() {
    this.isAdminMode = false;
    this.errorMsg = '';
  }

  // ---------------------------------------------------------
  // ADMIN LOGIN (NOW CALLS /admin/auth/login)
  // ---------------------------------------------------------
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
      next: (res: any) => {
        this.loading = false;

        // Your API sends the token inside ApiResponse.data
        const token = res.data?.token;
        const role = res.data?.role ?? 'ADMIN';

        if (!token) {
          this.errorMsg = 'Invalid response from server.';
          return;
        }

        this.auth.storeToken(token);  // <-- still using shared token storage

        this.closeModal();
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg =
          err.status === 401
            ? 'Invalid admin credentials.'
            : 'An unexpected error occurred.';
      }
    });
  }

  // ---------------------------------------------------------
  // USER LOGIN (unchanged)
  // ---------------------------------------------------------
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
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg =
          err.status === 401
            ? 'Invalid email or password.'
            : 'An unexpected error occurred.';
      }
    });
  }

  // ---------------------------------------------------------
  // REGISTER (unchanged)
  // ---------------------------------------------------------
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
      next: (res: any) => {
        this.auth.login(this.registerEmail, this.registerPassword).subscribe({
          next: (loginRes: any) => {
            this.auth.storeToken(loginRes.token);
            this.closeModal();
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.errorMsg = 'Registration succeeded, but auto-login failed.';
            this.loading = false;
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
