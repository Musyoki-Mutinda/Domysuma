import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectDetailsComponent
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    SharedModule
  ]
})
export class ProjectsModule { }
