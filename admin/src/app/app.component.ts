import { Component, OnInit } from '@angular/core';
import { MENU_ITEMS } from "./pages/pages-menu";
import { AdminTokenService } from './auth/admin-token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'admin';
  menu = MENU_ITEMS;

  constructor(private tokenService: AdminTokenService) {}

  ngOnInit() {
    // Capture tokens from redirect & store them
    this.tokenService.handleRedirectTokens();
  }
}
