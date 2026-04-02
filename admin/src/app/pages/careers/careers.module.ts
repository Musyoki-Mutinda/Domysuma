import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbButtonModule, NbInputModule, NbCheckboxModule, NbSpinnerModule, NbAlertModule, NbToggleModule, NbIconModule, NbDialogModule } from '@nebular/theme';

import { CareersRoutingModule } from './careers-routing.module';
import { CareersListComponent } from './list/list.component';
import { CareersCreateComponent } from './create/create.component';

@NgModule({
  declarations: [
    CareersListComponent,
    CareersCreateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CareersRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    NbCheckboxModule,
    NbSpinnerModule,
    NbAlertModule,
    NbToggleModule,
    NbIconModule,
    NbDialogModule
  ]
})
export class CareersModule { }