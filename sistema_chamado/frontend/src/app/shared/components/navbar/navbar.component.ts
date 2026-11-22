import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/guards/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (authService.isAuthenticated()) {
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div class="container">
          <a class="navbar-brand" routerLink="/dashboard">Sistema de Chamados</a>
          <div class="navbar-nav ms-auto">
            <a class="nav-link" routerLink="/dashboard">Dashboard</a>
            <a class="nav-link" routerLink="/novo-chamado">Novo Chamado</a>
            @if (authService.isTechOrAdmin()) { <a class="nav-link" routerLink="/relatorios">Relatórios</a> }
            @if (authService.isAdmin()) { <a class="nav-link" routerLink="/admin-usuarios">Usuários</a> }
            <a class="nav-link" routerLink="/trocar-senha">Alterar senha</a>
            <button class="btn btn-outline-light btn-sm ms-2" (click)="logout()">Sair</button>
          </div>
        </div>
      </nav>
    }
  `,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout().subscribe({next: () => this.router.navigate(['/login'])});
  }
}
