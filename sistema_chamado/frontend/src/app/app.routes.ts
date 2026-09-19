import { Routes } from '@angular/router';
import { authGuard, techGuard } from './core/guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { EsqueciSenhaComponent } from './pages/esqueci-senha/esqueci-senha.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NovoChamadoComponent } from './pages/novo-chamado/novo-chamado.component';
import { VerChamadoComponent } from './pages/ver-chamado/ver-chamado.component';
import { EditarChamadoComponent } from './pages/editar-chamado/editar-chamado.component';
import { AdminUsuariosComponent } from './pages/admin-usuarios/admin-usuarios.component';
import { RelatoriosComponent } from './pages/relatorios/relatorios.component';
import { TrocarSenhaComponent } from './pages/trocar-senha/trocar-senha.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'esqueci-senha', component: EsqueciSenhaComponent },
  
  // Rotas autenticadas
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'chamados/novo', component: NovoChamadoComponent, canActivate: [authGuard] },
  { path: 'chamados/:id', component: VerChamadoComponent, canActivate: [authGuard] },
  { path: 'chamados/:id/editar', component: EditarChamadoComponent, canActivate: [authGuard] },
  { path: 'trocar-senha', component: TrocarSenhaComponent, canActivate: [authGuard] },

  // Rotas restritas para TI / Administrador
  { path: 'admin/usuarios', component: AdminUsuariosComponent, canActivate: [authGuard, techGuard] },
  { path: 'relatorios', component: RelatoriosComponent, canActivate: [authGuard, techGuard] },

  { path: '**', redirectTo: 'dashboard' }
];
