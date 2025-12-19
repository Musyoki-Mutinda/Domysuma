import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'auth_token';
  private userRoleKey = 'user_role';

  isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password },{withCredentials: true}).pipe(
      tap((response) => {
        this.storeToken(response.token);
        this.storeRole(response.role);
        this.isLoggedIn$.next(true);
      })
    );
  }

  register(data: { fullName: string; email: string; password: string }) {
    return this.http.post<any>(`${this.baseUrl}/register`, data);
  }

  googleLoginRedirect() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
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
