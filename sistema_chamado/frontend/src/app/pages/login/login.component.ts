import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-wrap">
      <div class="auth-box">
        <div class="auth-logo">
          <img src="/assets/logo.png" alt="TV Diário" (error)="onImgError($event)" />
          <div class="logo-fallback-title" *ngIf="imgFailed">TV Diário</div>
          <div class="auth-logo-sub">Central de Chamados — TI & Operações</div>
        </div>

        <div class="auth-card card">
          <div class="card-title" style="margin-bottom: 18px; font-size: 17px; text-align: center;">
            Acesso ao Sistema
          </div>

          <div *ngIf="errorMessage" class="alert alert-error">
            <span>⚠️</span> {{ errorMessage }}
          </div>

          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="email">E-mail corporativo</label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="email"
                placeholder="voce@tvdiario.com"
                required
                autofocus
              />
            </div>

            <div class="form-group">
              <label for="senha">Senha</label>
              <input
                type="password"
                id="senha"
                name="senha"
                [(ngModel)]="senha"
                placeholder="••••••••"
                required
              />
            </div>

            <div class="auth-links">
              <a routerLink="/esqueci-senha">Esqueci minha senha</a>
            </div>

            <button type="submit" class="btn btn-primary btn-full" [disabled]="loading">
              <span *ngIf="!loading">Entrar no Sistema</span>
              <span *ngIf="loading">Entrando...</span>
            </button>
          </form>
        </div>

        <div class="auth-footer">
          Primeira vez aqui? <a routerLink="/cadastro">Criar conta</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      padding: 40px 16px;
    }
    .auth-box {
      width: 100%;
      max-width: 420px;
    }
    .auth-logo {
      text-align: center;
      margin-bottom: 24px;
    }
    .auth-logo img {
      max-height: 85px;
      margin: 0 auto 12px;
      display: block;
      object-fit: contain;
    }
    .logo-fallback-title {
      font-size: 26px;
      font-weight: 800;
      color: var(--accent);
      letter-spacing: -0.5px;
    }
    .auth-logo-sub {
      font-size: 13px;
      color: var(--muted);
      font-weight: 500;
    }
    .auth-card {
      padding: 32px 28px;
    }
    .auth-links {
      text-align: right;
      margin-bottom: 20px;
      margin-top: 4px;
    }
    .auth-links a {
      font-size: 12px;
      color: var(--accent);
    }
    .btn-full {
      width: 100%;
      padding: 12px;
      font-size: 14.5px;
    }
    .auth-footer {
      text-align: center;
      margin-top: 20px;
      font-size: 13px;
      color: var(--muted);
    }
    .auth-footer a {
      font-weight: 600;
      color: var(--accent);
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  senha = '';
  loading = false;
  errorMessage = '';
  imgFailed = false;

  onImgError(event: Event) {
    (event.target as HTMLElement).style.display = 'none';
    this.imgFailed = true;
  }

  onSubmit() {
    if (!this.email || !this.senha) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, senha: this.senha }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'E-mail ou senha inválidos. Tente novamente.';
      }
    });
  }
}
