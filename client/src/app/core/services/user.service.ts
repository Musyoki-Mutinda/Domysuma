import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userNameSubject = new BehaviorSubject<string | null>(null);
  userName$ = this.userNameSubject.asObservable();

  private avatarUrlSubject = new BehaviorSubject<string | null>(null);
  avatarUrl$ = this.avatarUrlSubject.asObservable();

  constructor() {
    // Check localStorage for stored user info on app load
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      this.userNameSubject.next(storedName);
    }
    const storedAvatar = localStorage.getItem('avatarUrl');
    if (storedAvatar) {
      this.avatarUrlSubject.next(storedAvatar);
    }
  }

  setUser(name: string, avatarUrl?: string) {
    this.userNameSubject.next(name);
    localStorage.setItem('userName', name);
    if (avatarUrl) {
      this.avatarUrlSubject.next(avatarUrl);
      localStorage.setItem('avatarUrl', avatarUrl);
    }
  }

  clearUser() {
    this.userNameSubject.next(null);
    this.avatarUrlSubject.next(null);
    localStorage.removeItem('userName');
    localStorage.removeItem('avatarUrl');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  clearAvatar() {
    this.avatarUrlSubject.next(null);
    localStorage.removeItem('avatarUrl');
  }
}
