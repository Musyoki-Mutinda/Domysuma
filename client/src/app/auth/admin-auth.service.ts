import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

  private api = 'https://your-api-domain.com/admin/auth';

  constructor(private http: HttpClient) {}

  // UPDATED: now accepts an object instead of 2 params
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.api}/login`, {
      username: credentials.email,   // your backend expects "username"
      password: credentials.password
    });
  }
}
