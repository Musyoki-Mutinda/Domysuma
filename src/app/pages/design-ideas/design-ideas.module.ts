import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesignIdeasRoutingModule } from './design-ideas-routing.module';
import { DesignIdeasComponent } from './design-ideas.component';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import {NbButtonModule, NbCardModule, NbIconModule, NbInputModule} from "@nebular/theme";


@NgModule({
  declarations: [
    DesignIdeasComponent,
    ListComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    DesignIdeasRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule
  ]
})
export class DesignIdeasModule { }
