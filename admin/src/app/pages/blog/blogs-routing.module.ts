import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogListComponent } from './list/list.component';
import { BlogCreateComponent } from './create/create.component';

const routes: Routes = [
  {
    path: '',
    component: BlogListComponent,
  },
  {
    path: 'create',
    component: BlogCreateComponent,
  },
  {
    path: 'edit/:id',
    component: BlogCreateComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogsRoutingModule { }
