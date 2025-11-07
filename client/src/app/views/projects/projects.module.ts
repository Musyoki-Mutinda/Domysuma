import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectCategoriesComponent } from './project-categories/project-categories.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    ProjectCategoriesComponent,
    ProjectListComponent,
    ProjectDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ProjectsRoutingModule,
    SharedModule
  ]
})
export class ProjectsModule { }
