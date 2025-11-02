import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // ✅ REQUIRED for fetching the RSS feed

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LayoutModule } from './views/layout/layout.module';
import { SharedModule } from './shared/shared.module';
import { GalleryModule } from 'ng-gallery';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    GalleryModule,
    AppRoutingModule,
    SharedModule,
    LayoutModule,
    HttpClientModule // ✅ must be added here
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
