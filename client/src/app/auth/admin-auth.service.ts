import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

  private api = `${environment.apiBaseUrl}/admin/auth`;

  constructor(private http: HttpClient) {}

  /**
   * Admin login - just make the request.
   * The component will handle the redirect regardless of response.
   */
  login(credentials: { email: string; password: string }): Observable<any> {
    const body = {
      username: credentials.email,
      password: credentials.password
    };

    return this.http.post(`${this.api}/login`, body, { withCredentials: true });
  }
}