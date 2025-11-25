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

  constructor(
    private auth: AuthService,
    private adminAuth: AdminAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Reveal hidden admin button on Shift + A
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
  // ADMIN LOGIN -> Redirect to Admin Angular App
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

        const token = res.data?.token;
        const role = res.data?.role;

        if (!token || role !== 'ADMIN') {
          this.errorMsg = 'Unauthorized. You are not an admin.';
          return;
        }

        // Store the token for the ADMIN APP only
        localStorage.setItem('admin_token', token);

        this.closeModal();

        // IMPORTANT: Redirect to the *Admin Angular Application*
        window.location.href = 'http://localhost:53579';

      },
      error: (err) => {
        this.loading = false;
        this.errorMsg =
          err.status === 401
            ? 'Invalid admin credentials.'
            : 'Admin login failed.';
      }
    });
  }

  // ---------------------------------------------------------
  // USER LOGIN
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
          // Backend can also flag ADMIN logins
          window.location.href = 'http://localhost:53579';
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

  // ---------------------------------------------------------
  // REGISTER
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
      next: () => {
        // Auto login after register
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
