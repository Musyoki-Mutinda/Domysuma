import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

  private api = "http://localhost:8200/admin/auth";

  constructor(private http: HttpClient) {}

  /**
   * Admin login form submission.
   * NOTE: The backend returns a REDIRECT (302), not JSON.
   * Angular cannot automatically follow backend redirects for POST.
   * Therefore: we open the login URL using a normal form submit or window.location.
   */
  login(credentials: { email: string; password: string }): void {
    const body = {
      username: credentials.email,
      password: credentials.password
    };

    // Instead of expecting JSON, we POST manually and intercept the redirect
    fetch(`${this.api}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include"
    })
    .then(response => {
      // Backend sends 302 redirect → browser receives the redirect URL in "response.url"
      if (response.redirected) {
        window.location.href = response.url;  // navigate to admin app with tokens
      } else {
        console.error("Login failed: No redirect received.");
      }
    })
    .catch(err => {
      console.error("Login error:", err);
    });
  }
}
