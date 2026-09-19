import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" *ngIf="authService.currentUser() as user">
      <div class="nav-container">
        <!-- Logo -->
        <a routerLink="/dashboard" class="nav-logo">
          <img src="/assets/logo.png" alt="TV Diário" (error)="onImgError($event)" />
          <span class="logo-fallback" *ngIf="imgFailed">TV Diário</span>
          <span class="nav-app-tag">Chamados</span>
        </a>

        <div class="nav-sep"></div>

        <!-- Links de Navegação -->
        <div class="nav-links">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
            📊 Dashboard
          </a>
          <a routerLink="/chamados/novo" routerLinkActive="active" class="nav-link">
            ➕ Novo Chamado
          </a>
          <ng-container *ngIf="authService.isTechOrAdmin()">
            <a routerLink="/relatorios" routerLinkActive="active" class="nav-link">
              📈 Relatórios
            </a>
            <a routerLink="/admin/usuarios" routerLinkActive="active" class="nav-link">
              👥 Usuários
            </a>
          </ng-container>
        </div>

        <!-- Perfil do Usuário -->
        <div class="nav-user">
          <div class="nav-user-info">
            <div class="nav-user-name">{{ user.nome }}</div>
            <div class="nav-user-dept">{{ user.departamento }}</div>
          </div>
          <div class="nav-avatar" [class.ti]="authService.isTechOrAdmin()">
            {{ getInitials(user.nome) }}
          </div>
          <div class="nav-actions">
            <a routerLink="/trocar-senha" title="Trocar Senha" class="btn btn-ghost btn-sm">
              🔑
            </a>
            <button (click)="logout()" title="Sair do Sistema" class="btn btn-ghost btn-sm nav-logout">
              🚪 Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: var(--bg2);
      border-bottom: 1px solid var(--border);
      height: 64px;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: var(--shadow-sm);
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 20px;
      gap: 12px;
    }
    .nav-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      flex-shrink: 0;
    }
    .nav-logo img {
      height: 38px;
      width: auto;
      object-fit: contain;
    }
    .logo-fallback {
      font-weight: 800;
      font-size: 18px;
      color: var(--accent);
      letter-spacing: -0.5px;
    }
    .nav-app-tag {
      font-size: 11px;
      font-weight: 700;
      background: var(--accent-lt);
      color: var(--accent);
      padding: 2px 7px;
      border-radius: 6px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .nav-sep {
      width: 1px;
      height: 24px;
      background: var(--border);
      margin: 0 8px;
    }
    .nav-links {
      display: flex;
      gap: 6px;
      flex: 1;
    }
    .nav-link {
      padding: 7px 14px;
      border-radius: var(--radius-sm);
      color: var(--muted);
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .nav-link:hover {
      background: var(--bg3);
      color: var(--text);
      text-decoration: none;
    }
    .nav-link.active {
      background: var(--accent-lt);
      color: var(--accent);
    }
    .nav-user {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-left: auto;
    }
    .nav-user-info {
      text-align: right;
      line-height: 1.25;
    }
    .nav-user-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--text);
    }
    .nav-user-dept {
      font-size: 11px;
      color: var(--muted);
    }
    .nav-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--accent-lt);
      border: 1.5px solid var(--accent-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      color: var(--accent);
      flex-shrink: 0;
    }
    .nav-avatar.ti {
      background: var(--purple-lt);
      border-color: var(--purple-md);
      color: var(--purple);
    }
    .nav-actions {
      display: flex;
      gap: 4px;
      align-items: center;
    }
    .nav-logout {
      color: var(--danger);
    }
    .nav-logout:hover {
      background: var(--danger-lt);
      color: var(--danger);
    }
    @media (max-width: 840px) {
      .nav-user-info {
        display: none;
      }
      .nav-links {
        overflow-x: auto;
      }
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  imgFailed = false;

  onImgError(event: Event) {
    (event.target as HTMLElement).style.display = 'none';
    this.imgFailed = true;
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  logout() {
    this.authService.logout();
  }
}
