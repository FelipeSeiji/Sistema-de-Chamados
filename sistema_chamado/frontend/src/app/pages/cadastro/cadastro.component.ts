import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { DEPARTAMENTOS_LIST, Departamento, UsuarioTipo } from '../../core/models/models';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-wrap">
      <div class="auth-box">
        <div class="auth-logo">
          <img src="/assets/logo.png" alt="TV Diário" (error)="onImgError($event)" />
          <div class="logo-fallback-title" *ngIf="imgFailed">TV Diário</div>
          <div class="auth-logo-sub">Cadastro de Colaborador</div>
        </div>

        <div class="auth-card card">
          <div class="card-title" style="margin-bottom: 18px; font-size: 17px; text-align: center;">
            Criar Nova Conta
          </div>

          <div *ngIf="errorMessage" class="alert alert-error">
            <span>⚠️</span> {{ errorMessage }}
          </div>

          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="nome">Nome Completo</label>
              <input
                type="text"
                id="nome"
                name="nome"
                [(ngModel)]="nome"
                placeholder="Ex: João da Silva"
                required
              />
            </div>

            <div class="form-group">
              <label for="email">E-mail corporativo</label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="email"
                placeholder="voce@tvdiario.com"
                required
              />
            </div>

            <div class="form-group">
              <label for="departamento">Departamento / Setor</label>
              <select id="departamento" name="departamento" [(ngModel)]="departamento" required>
                <option value="" disabled selected>Selecione seu departamento</option>
                <option *ngFor="let dep of departamentos" [value]="dep.value">
                  {{ dep.label }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="usuarioTipo">Perfil de Acesso</label>
              <select id="usuarioTipo" name="usuarioTipo" [(ngModel)]="usuarioTipo" required>
                <option value="USER">Colaborador / Solicitante</option>
                <option value="TECH">Técnico de Suporte (TI / Engenharia)</option>
              </select>
            </div>

            <div class="form-group">
              <label for="password">Senha de Acesso</label>
              <input
                type="password"
                id="password"
                name="password"
                [(ngModel)]="password"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <button type="submit" class="btn btn-primary btn-full" [disabled]="loading" style="margin-top: 8px;">
              <span *ngIf="!loading">Finalizar Cadastro</span>
              <span *ngIf="loading">Cadastrando...</span>
            </button>
          </form>
        </div>

        <div class="auth-footer">
          Já possui cadastro? <a routerLink="/login">Entrar</a>
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
      max-width: 440px;
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
      padding: 30px 28px;
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
export class CadastroComponent {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  nome = '';
  email = '';
  password = '';
  departamento: Departamento = 'JORNALISMO';
  usuarioTipo: UsuarioTipo = 'USER';
  departamentos = DEPARTAMENTOS_LIST;

  loading = false;
  errorMessage = '';
  imgFailed = false;

  onImgError(event: Event) {
    (event.target as HTMLElement).style.display = 'none';
    this.imgFailed = true;
  }

  onSubmit() {
    if (!this.nome || !this.email || !this.password || !this.departamento) {
      this.errorMessage = 'Preencha todos os campos obrigatórios.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const username = this.email.split('@')[0];

    this.userService
      .criar({
        nome: this.nome,
        username,
        email: this.email,
        password: this.password,
        departamento: this.departamento,
        usuarioTipo: this.usuarioTipo
      })
      .subscribe({
        next: (novoUser) => {
          this.authService.setUser(novoUser);
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erro ao criar conta. Verifique os dados informados.';
        }
      });
  }
}
