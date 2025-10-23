import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import {LayoutComponent} from "./layout.component";
import {SharedModule} from "../../shared/shared.module";
import {HomeComponent} from "../home/home.component";


@NgModule({
  declarations: [
    LayoutComponent,
    HomeComponent
  ],
  imports: [
    LayoutRoutingModule,
    SharedModule
  ]
})
export class LayoutModule { }
