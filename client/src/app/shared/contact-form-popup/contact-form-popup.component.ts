import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-contact-form-popup',
  templateUrl: './contact-form-popup.component.html',
  styleUrls: ['./contact-form-popup.component.scss']
})
export class ContactFormPopupComponent {
  @Output() close = new EventEmitter<void>();

  closePopup(): void {
    this.close.emit();
  }
}
