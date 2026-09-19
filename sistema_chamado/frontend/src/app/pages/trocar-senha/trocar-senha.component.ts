import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-trocar-senha',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="trocar-senha-page">
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">🔑 Alterar Minha Senha</div>
          <div class="page-sub">Mantenha sua conta corporativa sempre protegida</div>
        </div>
        <a routerLink="/dashboard" class="btn btn-ghost btn-sm">
          ← Voltar ao Dashboard
        </a>
      </div>

      <div class="card form-box">
        <div *ngIf="errorMessage" class="alert alert-error">
          <span>⚠️</span> {{ errorMessage }}
        </div>
        <div *ngIf="successMessage" class="alert alert-success">
          <span>✅</span> {{ successMessage }}
        </div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="senhaAtual">Senha Atual *</label>
            <input
              type="password"
              id="senhaAtual"
              [(ngModel)]="senhaAtual"
              name="senhaAtual"
              required
            />
          </div>

          <div class="form-group">
            <label for="novaSenha">Nova Senha *</label>
            <input
              type="password"
              id="novaSenha"
              [(ngModel)]="novaSenha"
              name="novaSenha"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div class="form-group">
            <label for="confirmaSenha">Confirmar Nova Senha *</label>
            <input
              type="password"
              id="confirmaSenha"
              [(ngModel)]="confirmaSenha"
              name="confirmaSenha"
              required
            />
          </div>

          <div class="form-actions" style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
            <a routerLink="/dashboard" class="btn btn-secondary">Cancelar</a>
            <button type="submit" class="btn btn-primary" [disabled]="loading">
              <span *ngIf="!loading">💾 Atualizar Senha</span>
              <span *ngIf="loading">Salvando...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .trocar-senha-page {
      max-width: 500px;
      margin: 0 auto;
      animation: fadeIn 0.15s ease-out;
    }
    .form-box {
      padding: 28px;
    }
  `]
})
export class TrocarSenhaComponent {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  senhaAtual = '';
  novaSenha = '';
  confirmaSenha = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  onSubmit(): void {
    if (!this.senhaAtual || !this.novaSenha || !this.confirmaSenha) {
      this.errorMessage = 'Preencha todos os campos.';
      return;
    }

    if (this.novaSenha !== this.confirmaSenha) {
      this.errorMessage = 'A nova senha e a confirmação não coincidem.';
      return;
    }

    const user = this.authService.currentUser();
    if (!user?.id) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService
      .trocarSenha(user.id, { senhaAtual: this.senhaAtual, novaSenha: this.novaSenha })
      .subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Senha alterada com sucesso! Redirecionando...';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Senha atual incorreta.';
        }
      });
  }
}
