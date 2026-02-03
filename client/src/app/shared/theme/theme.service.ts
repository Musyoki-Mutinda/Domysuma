import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkThemeClass = 'dark-theme';

  constructor() {}

  enableDarkTheme(): void {
    document.body.classList.add(this.darkThemeClass);
    localStorage.setItem('theme', 'dark');
  }

  disableDarkTheme(): void {
    document.body.classList.remove(this.darkThemeClass);
    localStorage.setItem('theme', 'light');
  }

  toggleTheme(): void {
    if (document.body.classList.contains(this.darkThemeClass)) {
      this.disableDarkTheme();
    } else {
      this.enableDarkTheme();
    }
  }

  loadSavedTheme(): void {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      this.enableDarkTheme();
    } else {
      this.disableDarkTheme();
    }
  }
}
