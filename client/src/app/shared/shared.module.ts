import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from "./components/header/header.component";
import {FooterComponent} from "./components/footer/footer.component";
import { PlanItemCardComponent } from './widgets/plan-item-card/plan-item-card.component';
import {RouterModule} from "@angular/router";
import { ContactFormPopupComponent } from './contact-form-popup/contact-form-popup.component';
import { PaginatorComponent } from './widgets/paginator/paginator.component';
import { BreadCrumbComponent } from './widgets/bread-crumb/bread-crumb.component';
import { ProjectItemCardComponent } from './widgets/project-item-card/project-item-card.component';
import { GalleryComponent } from './widgets/gallery/gallery.component';
import {GalleryModule} from "ng-gallery";



const components = [
  HeaderComponent,
  FooterComponent,
  PlanItemCardComponent,
  ProjectItemCardComponent,
  PaginatorComponent,
  BreadCrumbComponent,
  GalleryComponent,
  ContactFormPopupComponent
];

const modules = [
  RouterModule,
  GalleryModule
]

@NgModule({
  declarations: [
    ...components

  ],
  exports: [
    ...components,
    ...modules,
  ],
  imports: [
    CommonModule,
    ...modules,
  ]
})
export class SharedModule { }
