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

  // -------------------- LOGIN --------------------
  login(email: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap((response) => {
        this.storeToken(response.token);
        this.storeRole(response.role);
        this.isLoggedIn$.next(true);
      })
    );
  }

  // -------------------- REGISTER --------------------
  register(data: { fullName: string; email: string; password: string }) {
    return this.http.post<any>(`${this.baseUrl}/register`, data);
  }

  // -------------------- GOOGLE LOGIN --------------------
  googleLoginRedirect() {
    // The actual Spring Boot OAuth2 redirect
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

  // -------------------- TOKEN STORAGE --------------------
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

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}
