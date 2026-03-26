import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginModalService } from '../../../core/services/login-modal.service';
import { UserService } from '../../../core/services/user.service';
import { SavedProjectsService } from '../../../core/services/saved-projects.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  showContactForm = false;
  userDropdownOpen = false;
  settingsDropdownOpen = false;
  showPreferences = false;
  isDarkMode = false;
  mobileMenuOpen = false; // CHANGED: Set back to false (was true for testing)
  savedDropdownOpen = false;

  // Reactive property for the logged-in user
  userName: string | null = null;
  avatarUrl: string | null = null;

  // Saved projects
  savedProjects: any[] = [];
  totalSavedProjects: number = 0;

  constructor(
    private router: Router,
    private loginModalService: LoginModalService,
    private userService: UserService,
    private savedProjectsService: SavedProjectsService
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
      console.log('Header: userName updated to:', name);
      this.userName = name;
      if (name) {
        this.loadSavedProjects(); // Load saved projects when user logs in
      } else {
        this.savedProjects = []; // Clear when user logs out
        this.totalSavedProjects = 0;
      }
    });
    this.userService.avatarUrl$.subscribe(avatar => {
      console.log('Header: avatarUrl updated to:', avatar);
      this.avatarUrl = avatar;
    });
  }

  toggleUserDropdown(): void {
    this.userDropdownOpen = !this.userDropdownOpen;
    this.settingsDropdownOpen = false; // Close settings dropdown
    this.savedDropdownOpen = false; // Close saved dropdown
  }

  goToSystem() {
    this.router.navigate(['/careers']);
  }

  toggleSettingsDropdown(): void {
    this.settingsDropdownOpen = !this.settingsDropdownOpen;
    this.userDropdownOpen = false; // Close user dropdown
    this.savedDropdownOpen = false; // Close saved dropdown
  }

  closeDropdown(): void {
    this.userDropdownOpen = false;
    this.settingsDropdownOpen = false;
    this.savedDropdownOpen = false;
  }

  toggleSavedDropdown(): void {
    this.savedDropdownOpen = !this.savedDropdownOpen;
    if (this.savedDropdownOpen && this.userName) {
      this.loadSavedProjects();
    }
  }

  closeSavedDropdown(): void {
    this.savedDropdownOpen = false;
  }

  loadSavedProjects(): void {
    this.savedProjectsService.getSavedProjects().subscribe({
      next: (projects: any[]) => {
        this.totalSavedProjects = projects.length;
        this.savedProjects = projects.slice(0, 5); // Show only first 5 in dropdown
      },
      error: (err: any) => {
        console.error('Error loading saved projects:', err);
        this.savedProjects = [];
        this.totalSavedProjects = 0;
      }
    });
  }

  get savedProjectsCount(): number {
    return this.totalSavedProjects;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    // Prevent body scroll when menu is open
    if (this.mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  openPreferences(): void {
    this.showPreferences = true;
    this.closeDropdown();
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
    this.closeDropdown();
  }

  logout(): void {
    this.userService.clearUser();
    this.closeDropdown();
    this.router.navigate(['/home']);
  }

  openLogin(): void {
    this.loginModalService.open(); 
  }

  closeLogin(): void {
    this.loginModalService.close(); 
  }

  openWhatsApp(): void {
    const phoneNumber = '254701150425';
    const message = encodeURIComponent('Hello, I want to inquire about your services');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  }

  openSavedPlans(): void {
    this.router.navigate(['/saved-projects']);
  }

  onAvatarError(): void {
    // If avatar image fails to load, clear the avatar URL to show initials instead
    this.userService.clearAvatar();
  }

  getUserInitials(): string {
    if (!this.userName) return '';
    const names = this.userName.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }
}