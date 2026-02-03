import { Component, OnInit } from '@angular/core';
import {NbSidebarService} from "@nebular/theme";
import {LayoutService} from "../../../@core/layout.service";
import {AdminTokenService} from "../../../auth/admin-token.service";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private sidebarService: NbSidebarService,
    private layoutService: LayoutService,
    private adminTokenService: AdminTokenService
  ) { }

  ngOnInit(): void {
  }

  toggleSidebar() {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();
    return false;
  }

  navigateHome() {

  }

  logout() {
    this.adminTokenService.clearTokens();
    window.location.href = environment.clientUrl;
  }
}
