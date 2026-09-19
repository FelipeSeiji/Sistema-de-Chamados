import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ChamadoService } from '../../core/services/chamado.service';
import {
  Chamado,
  StatusChamado,
  CATEGORIAS_CONFIG
} from '../../core/models/models';

@Component({
  selector: 'app-ver-chamado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="ver-chamado-page" *ngIf="chamado">
      <!-- Topo: Voltar & Editar -->
      <div class="top-nav">
        <a routerLink="/dashboard" class="btn btn-ghost btn-sm">
          ← Voltar ao Dashboard
        </a>
        <div class="top-actions">
          <a
            *ngIf="podeEditar"
            [routerLink]="['/chamados', chamado.id, 'editar']"
            class="btn btn-secondary btn-sm"
          >
            ✏️ Editar Informações
          </a>
        </div>
      </div>

      <!-- Card Principal do Chamado -->
      <div class="card chamado-main-card">
        <!-- Badges de Cabeçalho -->
        <div class="badges-row">
          <span class="chamado-code">#{{ (chamado.id || '').substring(0, 8) }}</span>
          <span class="badge badge-{{ chamado.status }}">
            {{ formatarStatus(chamado.status) }}
          </span>
          <span class="badge badge-{{ chamado.prioridade }}">
            {{ chamado.prioridade }}
          </span>
          <span class="badge badge-category">
            {{ formatarCategoria(chamado.categoria) }}
          </span>
        </div>

        <h1 class="chamado-title">{{ chamado.titulo }}</h1>

        <!-- Descrição -->
        <div class="chamado-section">
          <div class="section-label">Descrição da Solicitação</div>
          <div class="chamado-desc-box">{{ chamado.descricao }}</div>
        </div>

        <!-- Solução Registrada (se existir) -->
        <div *ngIf="chamado.solucao" class="chamado-section solucao-box">
          <div class="section-label solucao-label">💡 Solução / Parecer Técnico</div>
          <div class="solucao-content">{{ chamado.solucao }}</div>
        </div>

        <!-- Metadados em Grid -->
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Solicitante</span>
            <span class="info-value">{{ chamado.usuario?.nome || '—' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Departamento</span>
            <span class="info-value">{{ chamado.usuario?.departamento || '—' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">E-mail do Solicitante</span>
            <span class="info-value">{{ chamado.usuario?.email || '—' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Data de Abertura</span>
            <span class="info-value">{{ formatarData(chamado.criadoEm) }}</span>
          </div>
        </div>
      </div>

      <!-- Painel de Gestão do Atendimento (Técnicos) -->
      <div *ngIf="authService.isTechOrAdmin()" class="card actions-panel">
        <div class="card-title">⚙️ Gestão do Atendimento (Painel TI)</div>

        <!-- Ação: Assumir Chamado -->
        <div *ngIf="chamado.status === 'ABERTO'" class="action-block">
          <p class="action-desc">
            Este chamado está aguardando atendimento. Clique abaixo para iniciar o trabalho.
          </p>
          <button class="btn btn-success" (click)="assumir()" [disabled]="actionLoading">
            ✋ Assumir e Iniciar Atendimento
          </button>
        </div>

        <!-- Ação: Atualizar Andamento & Adicionar Solução -->
        <div *ngIf="chamado.status === 'EM_ATENDIMENTO' || chamado.status === 'AGUARDANDO'" class="action-block">
          <div class="form-group">
            <label for="solucaoInput">Registrar Atualização / Solução Técnica</label>
            <textarea
              id="solucaoInput"
              [(ngModel)]="solucaoTexto"
              rows="3"
              placeholder="Descreva o diagnóstico, peças trocadas, procedimentos realizados ou motivo de aguardo..."
            ></textarea>
          </div>

          <div class="form-group">
            <label for="statusSelect">Alterar Status</label>
            <select id="statusSelect" [(ngModel)]="novoStatus">
              <option value="EM_ATENDIMENTO">⚙️ Em Atendimento</option>
              <option value="AGUARDANDO">⏳ Aguardando Peça / Solicitante</option>
            </select>
          </div>

          <div class="action-buttons-row">
            <button class="btn btn-primary" (click)="salvarAtualizacao()" [disabled]="actionLoading">
              💾 Salvar Atualização
            </button>
            <button class="btn btn-success" (click)="abrirModalConcluir()" [disabled]="actionLoading">
              ✅ Concluir Chamado
            </button>
          </div>
        </div>

        <!-- Ações para Chamados Finalizados -->
        <div *ngIf="chamado.status === 'CONCLUIDO' || chamado.status === 'CANCELADO'" class="action-block">
          <p class="action-desc">
            Este chamado está <strong>{{ formatarStatus(chamado.status) }}</strong>.
          </p>
          <button class="btn btn-secondary" (click)="reabrir()" [disabled]="actionLoading">
            🔄 Reabrir Chamado
          </button>
        </div>

        <!-- Botão Cancelar (Se não estiver concluído ou cancelado) -->
        <div *ngIf="chamado.status !== 'CONCLUIDO' && chamado.status !== 'CANCELADO'" class="cancel-row">
          <button class="btn btn-ghost btn-sm btn-danger-ghost" (click)="abrirModalCancelar()">
            ❌ Cancelar Chamado
          </button>
        </div>
      </div>

      <!-- Modal de Conclusão -->
      <div class="modal-overlay" *ngIf="exibirModalConcluir">
        <div class="modal-content">
          <div class="card-title" style="margin-bottom: 12px;">✅ Finalizar Chamado</div>
          <p style="font-size: 13px; color: var(--muted); margin-bottom: 16px;">
            Informe o resumo da solução aplicada antes de encerrar o chamado.
          </p>

          <div class="form-group">
            <label>Solução / Diagnóstico Final *</label>
            <textarea
              [(ngModel)]="motivoConclusao"
              rows="4"
              placeholder="Ex: Trocado cabo de rede e reconfigurado IP estático. Testado e validado com o usuário."
              required
            ></textarea>
          </div>

          <div class="form-actions" style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px;">
            <button class="btn btn-secondary" (click)="exibirModalConcluir = false">Cancelar</button>
            <button class="btn btn-success" (click)="concluir()" [disabled]="!motivoConclusao.trim() || actionLoading">
              Confirmar Conclusão
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de Cancelamento -->
      <div class="modal-overlay" *ngIf="exibirModalCancelar">
        <div class="modal-content">
          <div class="card-title" style="margin-bottom: 12px; color: var(--danger);">❌ Cancelar Chamado</div>
          <p style="font-size: 13px; color: var(--muted); margin-bottom: 16px;">
            Por favor, informe a justificativa para o cancelamento deste chamado.
          </p>

          <div class="form-group">
            <label>Motivo do Cancelamento</label>
            <textarea
              [(ngModel)]="motivoCancelamento"
              rows="3"
              placeholder="Ex: Chamado aberto em duplicidade ou resolvido antes do início."
            ></textarea>
          </div>

          <div class="form-actions" style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px;">
            <button class="btn btn-secondary" (click)="exibirModalCancelar = false">Voltar</button>
            <button class="btn btn-danger" (click)="cancelar()" [disabled]="actionLoading">
              Confirmar Cancelamento
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ver-chamado-page {
      max-width: 900px;
      margin: 0 auto;
      animation: fadeIn 0.15s ease-out;
    }
    .top-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .chamado-main-card {
      margin-bottom: 20px;
    }
    .badges-row {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }
    .chamado-code {
      font-family: monospace;
      font-weight: 700;
      color: var(--muted);
      font-size: 13px;
    }
    .badge-category {
      background: var(--bg3);
      color: var(--text);
      border: 1px solid var(--border);
    }
    .chamado-title {
      font-size: 22px;
      font-weight: 800;
      color: var(--text);
      margin-bottom: 20px;
      line-height: 1.3;
    }
    .chamado-section {
      margin-bottom: 24px;
    }
    .section-label {
      font-size: 11.5px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--muted);
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .chamado-desc-box {
      background: var(--bg3);
      padding: 16px 20px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      white-space: pre-wrap;
      font-size: 14px;
      line-height: 1.6;
    }
    .solucao-box {
      background: var(--success-lt);
      border: 1px solid var(--success-border);
      border-radius: var(--radius-sm);
      padding: 16px 20px;
    }
    .solucao-label {
      color: var(--success);
    }
    .solucao-content {
      color: #14532d;
      font-size: 14px;
      white-space: pre-wrap;
      line-height: 1.6;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      padding-top: 20px;
      border-top: 1px solid var(--border);
    }
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .info-label {
      font-size: 11.5px;
      color: var(--muted);
      font-weight: 600;
    }
    .info-value {
      font-size: 13.5px;
      font-weight: 600;
      color: var(--text);
    }
    .actions-panel {
      border-left: 4px solid var(--accent);
    }
    .action-block {
      margin-top: 16px;
    }
    .action-desc {
      font-size: 13.5px;
      color: var(--muted);
      margin-bottom: 14px;
    }
    .action-buttons-row {
      display: flex;
      gap: 12px;
      margin-top: 16px;
      flex-wrap: wrap;
    }
    .cancel-row {
      margin-top: 20px;
      padding-top: 14px;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: flex-end;
    }
    .btn-danger-ghost {
      color: var(--danger);
    }
    .btn-danger-ghost:hover {
      background: var(--danger-lt);
    }
  `]
})
export class VerChamadoComponent implements OnInit {
  authService = inject(AuthService);
  private chamadoService = inject(ChamadoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  chamado: Chamado | null = null;
  solucaoTexto = '';
  novoStatus: StatusChamado = 'EM_ATENDIMENTO';
  motivoConclusao = '';
  motivoCancelamento = '';

  actionLoading = false;
  exibirModalConcluir = false;
  exibirModalCancelar = false;

  get podeEditar(): boolean {
    if (!this.chamado) return false;
    const user = this.authService.currentUser();
    const isOwner = user?.id === this.chamado.usuario?.id;
    const isNotClosed = this.chamado.status !== 'CONCLUIDO' && this.chamado.status !== 'CANCELADO';
    return this.authService.isTechOrAdmin() || (isOwner && isNotClosed);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregar(id);
    }
  }

  carregar(id: string): void {
    this.chamadoService.buscarPorId(id).subscribe({
      next: (c) => {
        this.chamado = c;
        this.solucaoTexto = c.solucao || '';
        this.novoStatus = c.status === 'AGUARDANDO' ? 'AGUARDANDO' : 'EM_ATENDIMENTO';
      },
      error: () => {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  assumir(): void {
    if (!this.chamado?.id) return;
    this.actionLoading = true;
    this.chamadoService.assumir(this.chamado.id).subscribe({
      next: (atualizado) => {
        this.chamado = atualizado;
        this.actionLoading = false;
      },
      error: () => (this.actionLoading = false)
    });
  }

  salvarAtualizacao(): void {
    if (!this.chamado?.id) return;
    this.actionLoading = true;
    this.chamadoService
      .atualizar(this.chamado.id, {
        solucao: this.solucaoTexto,
        status: this.novoStatus
      })
      .subscribe({
        next: (atualizado) => {
          this.chamado = atualizado;
          this.actionLoading = false;
        },
        error: () => (this.actionLoading = false)
      });
  }

  abrirModalConcluir(): void {
    this.motivoConclusao = this.solucaoTexto || '';
    this.exibirModalConcluir = true;
  }

  concluir(): void {
    if (!this.chamado?.id) return;
    this.actionLoading = true;
    this.chamadoService
      .concluir(this.chamado.id, { motivo: this.motivoConclusao })
      .subscribe({
        next: (atualizado) => {
          this.chamado = atualizado;
          this.exibirModalConcluir = false;
          this.actionLoading = false;
        },
        error: () => (this.actionLoading = false)
      });
  }

  reabrir(): void {
    if (!this.chamado?.id) return;
    this.actionLoading = true;
    this.chamadoService.reabrir(this.chamado.id).subscribe({
      next: (atualizado) => {
        this.chamado = atualizado;
        this.actionLoading = false;
      },
      error: () => (this.actionLoading = false)
    });
  }

  abrirModalCancelar(): void {
    this.motivoCancelamento = '';
    this.exibirModalCancelar = true;
  }

  cancelar(): void {
    if (!this.chamado?.id) return;
    this.actionLoading = true;
    this.chamadoService
      .cancelar(this.chamado.id, { motivo: this.motivoCancelamento })
      .subscribe({
        next: (atualizado) => {
          this.chamado = atualizado;
          this.exibirModalCancelar = false;
          this.actionLoading = false;
        },
        error: () => (this.actionLoading = false)
      });
  }

  formatarCategoria(cat: string): string {
    const config = CATEGORIAS_CONFIG.find((c) => c.value === cat);
    return config ? `${config.icone} ${config.label}` : cat;
  }

  formatarStatus(status: StatusChamado): string {
    switch (status) {
      case 'ABERTO': return 'Aberto';
      case 'EM_ATENDIMENTO': return 'Em Atendimento';
      case 'AGUARDANDO': return 'Aguardando';
      case 'CONCLUIDO': return 'Concluído';
      case 'CANCELADO': return 'Cancelado';
      default: return status;
    }
  }

  formatarData(dt?: string): string {
    if (!dt) return '—';
    try {
      const data = new Date(dt);
      if (isNaN(data.getTime())) {
        return dt.substring(0, 16).replace('T', ' ');
      }
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dt;
    }
  }
}
