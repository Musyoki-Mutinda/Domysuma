import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import {
  NbActionsModule,
  NbContextMenuModule,
  NbIconModule,
  NbLayoutModule,
  NbSearchModule,
  NbSidebarModule,
  NbUserModule,
  NbMenuModule
} from "@nebular/theme";
import {OneColumnLayoutComponent} from "./layout";

@NgModule({
  declarations: [
    HeaderComponent,
    OneColumnLayoutComponent
  ],
  exports: [
    OneColumnLayoutComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    NbIconModule,
    NbActionsModule,
    NbSearchModule,
    NbUserModule,
    NbContextMenuModule,
    NbLayoutModule,
    NbSidebarModule,
    NbMenuModule
  ]
})
export class ThemeModule { }
