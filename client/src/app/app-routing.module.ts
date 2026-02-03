import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './views/layout/layout.component';
import { GoogleLoginSuccessComponent } from './auth/google-login-success.component';
import { HomeComponent } from './views/home/home.component';
import { AboutComponent } from './views/about/about.component';
import { HelpCenterComponent } from './pages/help-center/help-center.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      {
        path: 'plans',
        loadChildren: () => import('./views/plans/plans.module').then(m => m.PlansModule)
      },
      {
        path: 'projects',
        loadChildren: () => import('./views/projects/projects.module').then(m => m.ProjectsModule)
      },
      {
        path: 'blog',
        loadChildren: () => import('./views/blog/blog.module').then(m => m.BlogModule)
      },
      {
        path: 'services',
        loadChildren: () => import('./views/services/services.module').then(m => m.ServicesModule)
      },
      {
        path: 'saved-projects',
        loadChildren: () => import('./views/saved-projects/saved-projects.module').then(m => m.SavedProjectsModule)
      }
    ]
  },
  {
   path: 'login-success',
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
