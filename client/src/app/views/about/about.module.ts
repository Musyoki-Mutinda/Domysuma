import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';


@NgModule({
  declarations: [
    AboutComponent,
    TestimonialsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AboutComponent,
    TestimonialsComponent
  ]
})
export class AboutModule { }
