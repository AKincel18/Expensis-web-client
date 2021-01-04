import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppViewComponent } from './app-view/app-view.component';
import { ExpensesComponent } from './app-view/expenses/expenses.component';
import { MyProfileComponent } from './app-view/my-profile/my-profile.component';
import { StatisticsComponent } from './app-view/statistics/statistics.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'app',
    component: AppViewComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'expenses',
        component: ExpensesComponent,
      },
      {
        path: 'my-profile',
        component: MyProfileComponent,
      },
      {
        path: 'statistics',
        component: StatisticsComponent,
      },
      {
        path: '',
        redirectTo: 'expenses',
        pathMatch: 'full',
      },
    ],
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
