import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/auth/dashboard/dashboard.component';
import { IncomesComponent } from './features/auth/incomes/incomes.component';
import { EgresosComponent } from './features/auth/egresos/egresos.component';
import { DeudasComponent } from './features/auth/deudas/deudas.component';
import { UsersComponent } from './features/auth/users/users.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'incomes', component: IncomesComponent, canActivate: [authGuard] },
  { path: 'egresos', component: EgresosComponent, canActivate: [authGuard] },
  { path: 'deudas', component: DeudasComponent, canActivate: [authGuard] },
  { path: 'usuarios', component: UsersComponent, canActivate: [authGuard, roleGuard(['admin'])] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];