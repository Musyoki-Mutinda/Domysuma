// src/app/core/services/login-modal.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginModalService {
  private _isOpen$ = new BehaviorSubject<boolean>(false);

  /** Observable for components to react to modal state */
  isOpen$ = this._isOpen$.asObservable();

  /** Open the modal */
  open(): void {
    this._isOpen$.next(true);
  }

  /** Close the modal */
  close(): void {
    this._isOpen$.next(false);
  }
}
