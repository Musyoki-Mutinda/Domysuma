import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CareersListComponent } from './list/list.component';
import { CareersCreateComponent } from './create/create.component';

const routes: Routes = [
  {
    path: '',
    component: CareersCreateComponent
  },
  {
    path: 'list',
    component: CareersListComponent
  },
  {
    path: 'create',
    component: CareersCreateComponent
  },
  {
    path: 'edit/:id',
    component: CareersCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CareersRoutingModule { }