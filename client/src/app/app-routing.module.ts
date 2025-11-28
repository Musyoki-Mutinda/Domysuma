import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './views/layout/layout.component';
import { GoogleLoginSuccessComponent } from './auth/google-login-success.component';
import { HomeComponent } from './views/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
  },
  // Route to handle Google OAuth redirect after successful login
  {
    path: 'login-success',
    component: GoogleLoginSuccessComponent,
  },
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
