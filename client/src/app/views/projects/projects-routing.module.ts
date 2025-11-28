import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectCategoriesComponent } from './project-categories/project-categories.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';

const routes: Routes = [
  { path: '', component: ProjectCategoriesComponent },           // /projects
  { path: ':category', component: ProjectListComponent },        // /projects/libraries
  { path: ':category/:id', component: ProjectDetailsComponent }  // /projects/libraries/1
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
