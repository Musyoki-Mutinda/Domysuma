import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AdminGuard } from './auth/admin.guard'; 
import { AuthInterceptor } from './auth/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NbThemeModule, NbLayoutModule, NbSidebarModule, NbMenuModule} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {ThemeModule} from "./@theme/@theme.module";
import {CoreModule} from "./@core/core.module";
import { HTTP_INTERCEPTORS } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({name: 'corporate'}),
    NbLayoutModule,
    NbEvaIconsModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbMenuModule,
    ThemeModule,
    CoreModule
  ],
  providers: [
    AdminGuard,
    
    {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
