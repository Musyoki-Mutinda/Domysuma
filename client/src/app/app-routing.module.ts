import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './views/layout/layout.component';
import { GoogleLoginSuccessComponent } from './auth/google-login-success.component';
import { HomeComponent } from './views/home/home.component';
import { HelpCenterComponent } from './pages/help-center/help-center.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'google-login-success',
    component: GoogleLoginSuccessComponent
  },
  {
    path: 'help-center',
    component: HelpCenterComponent
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
