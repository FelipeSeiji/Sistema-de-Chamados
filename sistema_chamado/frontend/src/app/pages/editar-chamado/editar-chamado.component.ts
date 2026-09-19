import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChamadoService } from '../../core/services/chamado.service';
import {
  CATEGORIAS_CONFIG,
  CategoriaChamado,
  Prioridade,
  Chamado
} from '../../core/models/models';

@Component({
  selector: 'app-editar-chamado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="editar-chamado-page" *ngIf="chamado">
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">Editar Chamado #{{ (chamado.id || '').substring(0, 6) }}</div>
          <div class="page-sub">Atualize as informações do chamado</div>
        </div>
        <a [routerLink]="['/chamados', chamado.id]" class="btn btn-ghost btn-sm">
          ← Cancelar e Voltar
        </a>
      </div>

      <div class="card">
        <div *ngIf="errorMessage" class="alert alert-error">
          <span>⚠️</span> {{ errorMessage }}
        </div>

        <form (ngSubmit)="onSubmit()">
          <!-- Título -->
          <div class="form-group">
            <label for="titulo">Título do Problema *</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              [(ngModel)]="titulo"
              required
              maxlength="150"
            />
          </div>

          <!-- Categoria -->
          <div class="form-group">
            <label for="categoria">Área / Categoria *</label>
            <select
              id="categoria"
              name="categoria"
              [(ngModel)]="categoria"
              required
            >
              <option *ngFor="let cat of categorias" [value]="cat.value">
                {{ cat.icone }} {{ cat.label }}
              </option>
            </select>
          </div>

          <!-- Prioridade -->
          <div class="form-group">
            <label>Prioridade *</label>
            <div class="prio-grid">
              <div
                class="prio-box"
                [class.selected]="prioridade === 'BAIXA'"
                (click)="prioridade = 'BAIXA'"
              >
                <span>🟢 Baixa</span>
              </div>
              <div
                class="prio-box"
                [class.selected]="prioridade === 'MEDIA'"
                (click)="prioridade = 'MEDIA'"
              >
                <span>🔵 Média</span>
              </div>
              <div
                class="prio-box"
                [class.selected]="prioridade === 'ALTA'"
                (click)="prioridade = 'ALTA'"
              >
                <span>🟠 Alta</span>
              </div>
              <div
                class="prio-box"
                [class.selected]="prioridade === 'URGENTE'"
                (click)="prioridade = 'URGENTE'"
              >
                <span>🔴 Urgente</span>
              </div>
            </div>
          </div>

          <!-- Descrição -->
          <div class="form-group">
            <label for="descricao">Descrição *</label>
            <textarea
              id="descricao"
              name="descricao"
              [(ngModel)]="descricao"
              rows="6"
              required
            ></textarea>
          </div>

          <div class="form-actions" style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px;">
            <a [routerLink]="['/chamados', chamado.id]" class="btn btn-secondary">Cancelar</a>
            <button type="submit" class="btn btn-primary" [disabled]="loading">
              <span *ngIf="!loading">💾 Salvar Alterações</span>
              <span *ngIf="loading">Salvando...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .editar-chamado-page {
      max-width: 760px;
      margin: 0 auto;
      animation: fadeIn 0.15s ease-out;
    }
    .prio-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }
    .prio-box {
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 10px;
      text-align: center;
      cursor: pointer;
      background: var(--bg2);
      font-size: 13px;
      font-weight: 600;
      transition: all 0.15s ease;
      user-select: none;
    }
    .prio-box:hover {
      background: var(--bg3);
    }
    .prio-box.selected {
      border-color: var(--accent);
      background: var(--accent-lt);
      color: var(--accent);
    }
    @media (max-width: 600px) {
      .prio-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
  `]
})
export class EditarChamadoComponent implements OnInit {
  private chamadoService = inject(ChamadoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  chamado: Chamado | null = null;
  titulo = '';
  descricao = '';
  categoria: CategoriaChamado = 'TI_EQUIPAMENTOS';
  prioridade: Prioridade = 'MEDIA';

  categorias = CATEGORIAS_CONFIG;
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chamadoService.buscarPorId(id).subscribe({
        next: (c) => {
          this.chamado = c;
          this.titulo = c.titulo;
          this.descricao = c.descricao;
          this.categoria = c.categoria;
          this.prioridade = c.prioridade;
        },
        error: () => this.router.navigate(['/dashboard'])
      });
    }
  }

  onSubmit(): void {
    if (!this.chamado?.id || !this.titulo.trim() || !this.descricao.trim()) {
      this.errorMessage = 'Preencha todos os campos obrigatórios.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.chamadoService
      .editar(this.chamado.id, {
        titulo: this.titulo.trim(),
        descricao: this.descricao.trim(),
        categoria: this.categoria,
        prioridade: this.prioridade
      })
      .subscribe({
        next: (atualizado) => {
          this.loading = false;
          this.router.navigate(['/chamados', atualizado.id]);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erro ao atualizar chamado.';
        }
      });
  }
}
