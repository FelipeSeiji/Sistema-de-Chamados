import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-esqueci-senha',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-wrap">
      <div class="auth-box">
        <div class="auth-logo">
          <img src="/assets/logo.png" alt="TV Diário" (error)="onImgError($event)" />
          <div class="logo-fallback-title" *ngIf="imgFailed">TV Diário</div>
          <div class="auth-logo-sub">Recuperação de Acesso</div>
        </div>

        <div class="auth-card card">
          <div class="card-title" style="margin-bottom: 12px; font-size: 17px; text-align: center;">
            Esqueceu sua senha?
          </div>
          <p style="font-size: 13px; color: var(--muted); margin-bottom: 20px; text-align: center;">
            Entre em contato com o suporte de TI ou informe seu e-mail corporativo para solicitar a redefinição de acesso.
          </p>

          <div *ngIf="sucesso" class="alert alert-success">
            <span>✅</span> Solicitação enviada! A equipe de TI fará o reset da sua senha no painel administrativo.
          </div>

          <form *ngIf="!sucesso" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="email">E-mail corporativo cadastrado</label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="email"
                placeholder="voce@tvdiario.com"
                required
              />
            </div>

            <button type="submit" class="btn btn-primary btn-full" style="margin-top: 8px;">
              Solicitar Redefinição
            </button>
          </form>

          <div style="margin-top: 20px; text-align: center;">
            <a routerLink="/login" style="font-size: 13px; color: var(--accent); font-weight: 600;">
              ← Voltar para o Login
            </a>
          </div>
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
      max-height: 80px;
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
      padding: 30px 26px;
    }
    .btn-full {
      width: 100%;
      padding: 12px;
      font-size: 14px;
    }
  `]
})
export class EsqueciSenhaComponent {
  email = '';
  sucesso = false;
  imgFailed = false;

  onImgError(event: Event) {
    (event.target as HTMLElement).style.display = 'none';
    this.imgFailed = true;
  }

  onSubmit(): void {
    if (!this.email) return;
    this.sucesso = true;
  }
}
