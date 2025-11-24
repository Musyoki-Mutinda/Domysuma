import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HomeComponent } from '../home/home.component';
import { AboutComponent } from '../about/about.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LayoutComponent,
    HomeComponent,
    AboutComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    LayoutRoutingModule,
    SharedModule,
    FormsModule
  ],
  exports: [
    LayoutComponent   // optionally export this if AppModule uses it
  ]
})
export class LayoutModule {}
