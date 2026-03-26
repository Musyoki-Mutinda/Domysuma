import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CareersComponent } from './careers.component';
import { CareerDetailComponent } from './career-detail/career-detail.component';

const routes: Routes = [
  {
    path: '',
    component: CareersComponent
  },
  {
    path: ':id',
    component: CareerDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CareersRoutingModule { }
