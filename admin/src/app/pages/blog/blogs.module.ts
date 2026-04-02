import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NbCardModule, NbButtonModule, NbInputModule, NbSelectModule, NbToggleModule, NbIconModule, NbDatepickerModule, NbTimepickerModule, NbFormFieldModule } from '@nebular/theme';

import { BlogsRoutingModule } from './blogs-routing.module';
import { BlogListComponent } from './list/list.component';
import { BlogCreateComponent } from './create/create.component';
import { BlogService } from './blog.service';

@NgModule({
  declarations: [
    BlogListComponent,
    BlogCreateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BlogsRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    NbSelectModule,
    NbToggleModule,
    NbIconModule,
    NbDatepickerModule,
    NbTimepickerModule,
    NbFormFieldModule
  ],
  providers: [BlogService]
})
export class BlogsModule { }
