import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CareersRoutingModule } from './careers-routing.module';
import { CareersComponent } from './careers.component';
import { CareerDetailComponent } from './career-detail/career-detail.component';

@NgModule({
  declarations: [
    CareersComponent,
    CareerDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CareersRoutingModule
  ]
})
export class CareersModule { }
