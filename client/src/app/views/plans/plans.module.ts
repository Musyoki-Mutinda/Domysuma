import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlansRoutingModule } from './plans-routing.module';
import { PlanListComponent } from './plan-list/plan-list.component';
import { PlanDetailsComponent } from './plan-details/plan-details.component';
import {SharedModule} from "../../shared/shared.module";
import { ModifyPlanComponent } from './modify-plan/modify-plan.component';


@NgModule({
  declarations: [
    PlanListComponent,
    PlanDetailsComponent,
    ModifyPlanComponent
  ],
  imports: [
    CommonModule,
    PlansRoutingModule,
    SharedModule
  ]
})
export class PlansModule { }
