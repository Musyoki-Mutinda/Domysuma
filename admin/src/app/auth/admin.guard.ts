import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // TODO: Replace this with real admin role check
    const isAdminLoggedIn = true; // temporary

    if (!isAdminLoggedIn) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
}
