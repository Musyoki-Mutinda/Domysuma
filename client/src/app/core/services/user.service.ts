import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userNameSubject = new BehaviorSubject<string | null>(null);
  userName$ = this.userNameSubject.asObservable();

  constructor() {
    // Check localStorage for stored user info on app load
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      this.userNameSubject.next(storedName);
    }
  }

  setUser(name: string) {
    this.userNameSubject.next(name);
    localStorage.setItem('userName', name);
  }

  clearUser() {
    this.userNameSubject.next(null);
    localStorage.removeItem('userName');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
