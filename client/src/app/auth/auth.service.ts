import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../core/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.apiBaseUrl}/auth`;
  private tokenKey = 'auth_token';
  private userRoleKey = 'user_role';

  isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private userService: UserService) {}

  login(email: string, password: string) {
    return this.http.post(`${this.baseUrl}/login`, { email, password }, {
      observe: 'response',
      responseType: 'json',
      withCredentials: true
    }).pipe(
      tap((response: any) => {
        // Extract data from JSON response body
        const data = response.body;
        if (data && data.access_token) {
          const accessToken = data.access_token;
          const refreshToken = data.refresh_token;
          const fullName = data.fullName;
          const role = data.role || 'USER';

          // Store the extracted data
          this.storeToken(accessToken);
          this.storeRole(role);
          this.isLoggedIn$.next(true);

          // Set user information for header display
          if (fullName) {
            this.userService.setUser(fullName);
          }
        }
      }),
      map((response: any) => {
        // Return parsed response for component consumption
        const data = response.body;
        if (data) {
          return {
            token: data.access_token,
            refreshToken: data.refresh_token,
            fullName: data.fullName,
            role: data.role || 'USER'
          };
        }
        return response.body;
      })
    );
  }

  register(data: { firstName: string; lastName: string; email: string; password: string }) {
    return this.http.post<any>(`${this.baseUrl}/register`, data);
  }

  googleLoginRedirect() {
    window.location.href = `${environment.apiBaseUrl}/oauth2/authorization/google`;
  }

  storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  storeRole(role: string) {
    localStorage.setItem(this.userRoleKey, role);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  getRole() {
    return localStorage.getItem(this.userRoleKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userRoleKey);
    this.isLoggedIn$.next(false);
  }

  public hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // 🔥 New: extract user ID from JWT token
  getCurrentUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.userId || null;
    } catch (e) {
      return null;
    }
  }
}
