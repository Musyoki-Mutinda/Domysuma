import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component'; 
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import {NbButtonModule, NbCardModule, NbIconModule, NbInputModule} from "@nebular/theme";


@NgModule({
  declarations: [
    ProjectsComponent,
    ListComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    ReactiveFormsModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule
  ]
})
export class ProjectsModule { }
