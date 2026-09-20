import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/guards/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4" *ngIf="authService.isAuthenticated()">
      <div class="container">
        <a class="navbar-brand" routerLink="/dashboard">Sistema de Chamados</a>
        <div class="navbar-nav ms-auto">
          <a class="nav-link" routerLink="/dashboard">Dashboard</a>
          <a class="nav-link" routerLink="/novo-chamado">Novo Chamado</a>
          <button class="btn btn-outline-light btn-sm ms-2" (click)="authService.logout()">Sair</button>
        </div>
      </div>
    </nav>
  `,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  public authService = inject(AuthService);
}