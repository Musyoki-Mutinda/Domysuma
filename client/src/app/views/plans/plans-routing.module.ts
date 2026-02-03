import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanListComponent } from './plan-list/plan-list.component';
import { PlanDetailsComponent } from './plan-details/plan-details.component';
import { ModifyPlanComponent } from './modify-plan/modify-plan.component';

const routes: Routes = [
  {
    path: '',
    component: PlanListComponent,
  },
  {
    path: 'modify/:id',
    component: ModifyPlanComponent,
  },
  {
    path: ':id',
    component: PlanDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlansRoutingModule {}
