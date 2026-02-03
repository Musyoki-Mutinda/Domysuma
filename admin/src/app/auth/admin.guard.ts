import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AdminTokenService } from './admin-token.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: AdminTokenService
  ) {}

  canActivate() {
    const token = this.tokenService.getAccessToken();

    if (!token) {
      this.router.navigate(['/login']);
      return of(false);
    }

    return this.http.get(`${environment.apiBaseUrl.replace('/api', '')}/admin/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map((user: any) => {
        if (user && user.roles?.includes('ADMIN')) {
          return true;
        }
        this.router.navigate(['/unauthorized']);
        return false;
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
