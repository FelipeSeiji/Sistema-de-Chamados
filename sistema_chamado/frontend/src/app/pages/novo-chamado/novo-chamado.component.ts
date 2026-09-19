import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ChamadoService } from '../../core/services/chamado.service';
import { UserService } from '../../core/services/user.service';
import {
  CATEGORIAS_CONFIG,
  CategoriaChamado,
  Prioridade,
  Usuario
} from '../../core/models/models';

@Component({
  selector: 'app-novo-chamado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="novo-chamado-page">
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">Abrir Novo Chamado</div>
          <div class="page-sub">Descreva a solicitação ou incidente com o máximo de detalhes</div>
        </div>
        <a routerLink="/dashboard" class="btn btn-ghost btn-sm">
          ← Voltar ao Dashboard
        </a>
      </div>

      <div class="form-container">
        <div class="card">
          <div *ngIf="errorMessage" class="alert alert-error">
            <span>⚠️</span> {{ errorMessage }}
          </div>

          <form (ngSubmit)="onSubmit()">
            <!-- Solicitante (Técnico pode abrir para outros) -->
            <div *ngIf="authService.isTechOrAdmin()" class="form-group">
              <label for="solicitante">Autor / Solicitante do Chamado</label>
              <select id="solicitante" name="solicitanteId" [(ngModel)]="solicitanteId">
                <option [value]="currentUser?.id">Eu mesmo ({{ currentUser?.nome }})</option>
                <option *ngFor="let u of usuarios" [value]="u.id">
                  {{ u.nome }} — {{ u.departamento }}
                </option>
              </select>
            </div>

            <!-- Título -->
            <div class="form-group">
              <label for="titulo">Título do Problema *</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                [(ngModel)]="titulo"
                placeholder="Ex: Falha na ilha de edição 2, computador não liga, sem acesso ao e-mail..."
                required
                maxlength="150"
              />
            </div>

            <!-- Categoria e Subcategoria -->
            <div class="grid-2">
              <div class="form-group">
                <label for="categoria">Área / Categoria *</label>
                <select
                  id="categoria"
                  name="categoria"
                  [(ngModel)]="categoriaSelecionada"
                  (change)="onCategoriaChange()"
                  required
                >
                  <option value="" disabled selected>Selecione a categoria</option>
                  <option *ngFor="let cat of categorias" [value]="cat.value">
                    {{ cat.icone }} {{ cat.label }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="subcategoria">Subcategoria / Detalhe</label>
                <select
                  id="subcategoria"
                  name="subcategoria"
                  [(ngModel)]="subcategoriaSelecionada"
                  [disabled]="!categoriaSelecionada"
                >
                  <option value="">Selecione um tópico específico (opcional)</option>
                  <option *ngFor="let sub of subcategoriasDisponiveis" [value]="sub">
                    {{ sub }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Prioridade -->
            <div class="form-group">
              <label>Nível de Prioridade *</label>
              <div class="prio-selector">
                <div
                  class="prio-card"
                  [class.selected]="prioridade === 'BAIXA'"
                  (click)="prioridade = 'BAIXA'"
                >
                  <span class="prio-icon">🟢</span>
                  <div class="prio-info">
                    <span class="prio-title">Baixa</span>
                    <span class="prio-desc">Pode aguardar fila</span>
                  </div>
                </div>

                <div
                  class="prio-card"
                  [class.selected]="prioridade === 'MEDIA'"
                  (click)="prioridade = 'MEDIA'"
                >
                  <span class="prio-icon">🔵</span>
                  <div class="prio-info">
                    <span class="prio-title">Média</span>
                    <span class="prio-desc">Rotina normal de trabalho</span>
                  </div>
                </div>

                <div
                  class="prio-card"
                  [class.selected]="prioridade === 'ALTA'"
                  (click)="prioridade = 'ALTA'"
                >
                  <span class="prio-icon">🟠</span>
                  <div class="prio-info">
                    <span class="prio-title">Alta</span>
                    <span class="prio-desc">Impacta entregas do dia</span>
                  </div>
                </div>

                <div
                  class="prio-card urgente"
                  [class.selected]="prioridade === 'URGENTE'"
                  (click)="prioridade = 'URGENTE'"
                >
                  <span class="prio-icon">🔴</span>
                  <div class="prio-info">
                    <span class="prio-title">Urgente</span>
                    <span class="prio-desc">Ao vivo / Operação parada</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Descrição -->
            <div class="form-group">
              <label for="descricao">Descrição Detalhada do Ocorrido *</label>
              <textarea
                id="descricao"
                name="descricao"
                [(ngModel)]="descricao"
                rows="5"
                placeholder="Explique o que aconteceu, mensagens de erro exibidas, qual equipamento ou sistema está envolvido..."
                required
              ></textarea>
            </div>

            <!-- Botões de Ação -->
            <div class="form-actions">
              <a routerLink="/dashboard" class="btn btn-secondary">Cancelar</a>
              <button type="submit" class="btn btn-primary" [disabled]="loading">
                <span *ngIf="!loading">🚀 Registrar Chamado</span>
                <span *ngIf="loading">Registrando...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .novo-chamado-page {
      max-width: 800px;
      margin: 0 auto;
      animation: fadeIn 0.15s ease-out;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .prio-selector {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    .prio-card {
      background: var(--bg2);
      border: 2px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 12px 10px;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      transition: all 0.15s ease;
      user-select: none;
    }
    .prio-card:hover {
      border-color: var(--border2);
      background: var(--bg3);
    }
    .prio-card.selected {
      border-color: var(--accent);
      background: var(--accent-lt);
    }
    .prio-card.urgente.selected {
      border-color: var(--danger);
      background: var(--danger-lt);
    }
    .prio-icon {
      font-size: 20px;
    }
    .prio-info {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }
    .prio-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--text);
    }
    .prio-desc {
      font-size: 10.5px;
      color: var(--muted);
      margin-top: 2px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }
    @media (max-width: 700px) {
      .grid-2 {
        grid-template-columns: 1fr;
      }
      .prio-selector {
        grid-template-columns: 1fr 1fr;
      }
    }
  `]
})
export class NovoChamadoComponent implements OnInit {
  authService = inject(AuthService);
  private chamadoService = inject(ChamadoService);
  private userService = inject(UserService);
  private router = inject(Router);

  currentUser = this.authService.currentUser();
  usuarios: Usuario[] = [];

  solicitanteId = this.currentUser?.id || '';
  titulo = '';
  descricao = '';
  categoriaSelecionada: CategoriaChamado | '' = '';
  subcategoriaSelecionada = '';
  prioridade: Prioridade = 'MEDIA';

  categorias = CATEGORIAS_CONFIG;
  subcategoriasDisponiveis: string[] = [];

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    if (this.authService.isTechOrAdmin()) {
      this.userService.listar().subscribe({
        next: (users) => {
          this.usuarios = users;
        }
      });
    }
  }

  onCategoriaChange(): void {
    const config = this.categorias.find((c) => c.value === this.categoriaSelecionada);
    this.subcategoriasDisponiveis = config ? config.subcategorias : [];
    this.subcategoriaSelecionada = '';
  }

  onSubmit(): void {
    if (!this.titulo.trim() || !this.descricao.trim() || !this.categoriaSelecionada) {
      this.errorMessage = 'Preencha todos os campos obrigatórios (*).';
      return;
    }

    const autorId = this.solicitanteId || this.currentUser?.id;
    if (!autorId) {
      this.errorMessage = 'Usuário não identificado.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const descricaoCompleta = this.subcategoriaSelecionada
      ? `[Subcategoria: ${this.subcategoriaSelecionada}]\n${this.descricao}`
      : this.descricao;

    this.chamadoService
      .abrirChamado(
        {
          titulo: this.titulo.trim(),
          descricao: descricaoCompleta.trim(),
          categoria: this.categoriaSelecionada as CategoriaChamado,
          prioridade: this.prioridade
        },
        autorId
      )
      .subscribe({
        next: (criado) => {
          this.loading = false;
          this.router.navigate(['/chamados', criado.id]);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erro ao registrar chamado. Tente novamente.';
        }
      });
  }
}
