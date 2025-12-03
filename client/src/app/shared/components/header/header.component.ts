import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginModalService } from '../../../core/services/login-modal.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  showContactForm = false;
  dropdownOpen = false;
  showPreferences = false;
  isDarkMode = false;

  // Reactive property for the logged-in user
  userName: string | null = null;

  constructor(
    private router: Router,
    private loginModalService: LoginModalService,
    private userService: UserService  // <-- inject UserService
  ) {}

  ngOnInit(): void {
    // Check for dark mode preference
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
      this.isDarkMode = true;
      document.body.classList.add('dark-mode');
    }

    // Subscribe to user state to update header reactively
    this.userService.userName$.subscribe(name => {
      this.userName = name;
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  openPreferences(): void {
    this.showPreferences = true;
    this.dropdownOpen = false;
  }

  goToHelpCenter(): void {
    this.router.navigate(['/help-center']);
  }

  toggleDarkMode(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    this.isDarkMode = checked;
    localStorage.setItem('darkMode', String(checked));
    this.dropdownOpen = false;
  }

  logout(): void {
    // Clear user data via UserService
    this.userService.clearUser();
    this.dropdownOpen = false;

    // Redirect to homepage
    this.router.navigate(['/home']);
  }

  openLogin(): void {
    this.loginModalService.open(); 
  }

  closeLogin(): void {
    this.loginModalService.close(); 
  }

  openWhatsApp(): void {
    const phoneNumber = '254112049044';
    const message = encodeURIComponent('Hello, I want to inquire about your services');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  }

  openSavedPlans(): void {
    this.router.navigate(['/saved-plans']);
  }
}
