import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
      this.isDarkMode = true;
      document.body.classList.add('dark-mode');
    }
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

  openHelpCenter(): void {
    this.router.navigate(['/help']);
    this.dropdownOpen = false;
  }

  toggleDarkMode(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.isDarkMode = checked;

    if (checked) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    localStorage.setItem('darkMode', String(checked));
    this.dropdownOpen = false;
  }

  logout(): void {
    console.log('User logged out');
    this.dropdownOpen = false;
  }

  showLoginModal = false;

  openLogin() {
    this.showLoginModal = true;
  }

  closeLogin() {
    this.showLoginModal = false;
  }

  // header.component.ts
  openWhatsApp() {
  const phoneNumber = '254112049044';
  const message = encodeURIComponent('Hello, I want to inquire about your services');
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}


}

