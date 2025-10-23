import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./layout.component";
import {HomeComponent} from "../home/home.component";

const routes: Routes = [
  {
    path: '',
component: LayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'plans',
        loadChildren: () => import('../plans/plans.module').then(m => m.PlansModule)
      },
      {
        path: 'projects',
        loadChildren: () => import('../projects/projects.module').then(m => m.ProjectsModule)
      },
      {
        path: 'blog',
        loadChildren: () => import('../blog/blog.module').then(m => m.BlogModule)
      },
      {
        path: 'services',
        loadChildren: () => import('../services/services.module').then(m => m.ServicesModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
