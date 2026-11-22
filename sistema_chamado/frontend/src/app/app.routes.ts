import { Routes } from '@angular/router';
import { authGuard, techGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./pages/cadastro/cadastro.component').then(m => m.CadastroComponent)
  },
  {
    path: 'esqueci-senha',
    loadComponent: () => import('./pages/esqueci-senha/esqueci-senha.component').then(m => m.EsqueciSenhaComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'novo-chamado',
    loadComponent: () => import('./pages/novo-chamado/novo-chamado.component').then(m => m.NovoChamadoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'ver-chamado/:id',
    loadComponent: () => import('./pages/ver-chamado/ver-chamado.component').then(m => m.VerChamadoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'editar-chamado/:id',
    loadComponent: () => import('./pages/editar-chamado/editar-chamado.component').then(m => m.EditarChamadoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'trocar-senha',
    loadComponent: () => import('./pages/trocar-senha/trocar-senha.component').then(m => m.TrocarSenhaComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin-usuarios',
    loadComponent: () => import('./pages/admin-usuarios/admin-usuarios.component').then(m => m.AdminUsuariosComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'relatorios',
    loadComponent: () => import('./pages/relatorios/relatorios.component').then(m => m.RelatoriosComponent),
    canActivate: [techGuard]
  },
  { path: '**', redirectTo: 'dashboard' }
];
