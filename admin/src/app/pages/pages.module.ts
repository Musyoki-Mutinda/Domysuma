import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import {NbMenuModule} from "@nebular/theme";
import {ThemeModule} from "../@theme/@theme.module";
import {PagesRoutingModule} from "./pages-routing.module";
import {DesignIdeasModule} from "./design-ideas/design-ideas.module";



@NgModule({
  declarations: [
    PagesComponent
  ],
  imports: [
    CommonModule,
    NbMenuModule,
    ThemeModule,
    PagesRoutingModule,
    DesignIdeasModule
  ]
})
export class PagesModule { }
