import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminTokenService {

  private accessKey = 'admin_access_token';
  private refreshKey = 'admin_refresh_token';

  handleRedirectTokens() {
    const params = new URLSearchParams(window.location.search);

    const access = params.get('access');
    const refresh = params.get('refresh');

    if (access) {
      localStorage.setItem(this.accessKey, access);
    }

    if (refresh) {
      localStorage.setItem(this.refreshKey, refresh);
    }

    if (access || refresh) {
      params.delete('access');
      params.delete('refresh');

      const cleanUrl =
        window.location.pathname +
        (params.toString() ? '?' + params.toString() : '');

      window.history.replaceState({}, '', cleanUrl);
    }
  }

  getAccessToken() {
    return this.getCookie(this.accessKey);
  }

  getRefreshToken() {
    return this.getCookie(this.refreshKey);
  }

  clearTokens() {
    this.deleteCookie(this.accessKey);
    this.deleteCookie(this.refreshKey);
  }

  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  private deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}
