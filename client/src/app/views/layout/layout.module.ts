import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from '../home/home.component';

@NgModule({
  declarations: [
    LayoutComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,          // ✅ Needed for *ngIf, *ngFor, and pipes like 'date'
    HttpClientModule,      // ✅ Enables HTTP requests
    LayoutRoutingModule,
    SharedModule
  ]
})
export class LayoutModule { }
