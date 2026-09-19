import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { Usuario } from '../../core/models/models';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-usuarios-page">
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">👥 Administração de Usuários</div>
          <div class="page-sub">Gerencie os acessos, permissões e status dos colaboradores</div>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-secondary btn-sm" (click)="abrirModalImportar()">
            📥 Importar Colaboradores
          </button>
          <button class="btn btn-primary btn-sm" (click)="carregarUsuarios()">
            🔄 Atualizar Lista
          </button>
        </div>
      </div>

      <!-- Filtros e Busca -->
      <div class="filter-bar">
        <div class="filter-tabs">
          <button
            class="btn btn-ghost btn-sm"
            [class.active]="filtroTipo === 'TODOS'"
            (click)="filtrarTipo('TODOS')"
          >
            👁️ Todos ({{ todosUsuarios.length }})
          </button>
          <button
            class="btn btn-ghost btn-sm"
            [class.active]="filtroTipo === 'TECH'"
            (click)="filtrarTipo('TECH')"
          >
            ⚙️ Equipe TI / Eng ({{ totalTechs }})
          </button>
          <button
            class="btn btn-ghost btn-sm"
            [class.active]="filtroTipo === 'USER'"
            (click)="filtrarTipo('USER')"
          >
            👤 Colaboradores ({{ totalUsers }})
          </button>
        </div>

        <div class="search-box">
          <input
            type="text"
            [(ngModel)]="termoBusca"
            (input)="aplicarFiltro()"
            placeholder="🔍 Filtrar por nome, email ou departamento..."
          />
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-box card">
        <div class="spinner"></div>
        <p>Carregando lista de usuários...</p>
      </div>

      <!-- Tabela -->
      <div class="table-wrap" *ngIf="!loading && usuariosPaginados.length > 0">
        <table>
          <thead>
            <tr>
              <th>Colaborador</th>
              <th>E-mail</th>
              <th>Departamento</th>
              <th>Perfil</th>
              <th style="text-align: center;">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of usuariosPaginados">
              <td>
                <div class="user-row-info">
                  <span class="user-name">{{ u.nome || 'Sem Nome' }}</span>
                  <span *ngIf="u.id === authService.currentUser()?.id" class="badge-you">você</span>
                </div>
              </td>
              <td class="user-email">{{ u.email || '—' }}</td>
              <td>{{ u.departamento || '—' }}</td>
              <td>
                <span
                  class="badge"
                  [ngClass]="u.usuarioTipo === 'TECH' || u.usuarioTipo === 'ADMIN' ? 'badge-ti' : 'badge-user'"
                >
                  {{ u.usuarioTipo === 'TECH' || u.usuarioTipo === 'ADMIN' ? '⚙️ TI / Engenharia' : '👤 Usuário' }}
                </span>
              </td>
              <td style="text-align: center;">
                <div class="actions-group">
                  <!-- Redefinir Senha -->
                  <button
                    class="btn btn-ghost btn-sm"
                    (click)="abrirModalRedefinir(u)"
                    title="Redefinir Senha"
                  >
                    🔑 Senha
                  </button>

                  <!-- Excluir (Se não for ele mesmo) -->
                  <button
                    *ngIf="u.id !== authService.currentUser()?.id"
                    class="btn btn-ghost btn-sm btn-delete"
                    (click)="excluirUsuario(u)"
                    title="Excluir Usuário"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Paginação -->
        <div class="pagination-bar" *ngIf="totalPaginas > 1">
          <span class="pag-info">
            Mostrando {{ (paginaAtual - 1) * itensPorPagina + 1 }} a {{ getFimPagina() }} de {{ usuariosFiltrados.length }} usuários
          </span>
          <div class="pag-buttons">
            <button class="btn btn-ghost btn-sm" [disabled]="paginaAtual === 1" (click)="mudarPagina(paginaAtual - 1)">
              ← Anterior
            </button>
            <span class="pag-current">{{ paginaAtual }} / {{ totalPaginas }}</span>
            <button class="btn btn-ghost btn-sm" [disabled]="paginaAtual === totalPaginas" (click)="mudarPagina(paginaAtual + 1)">
              Próxima →
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && usuariosFiltrados.length === 0" class="empty-state card">
        <div class="empty-icon">👥</div>
        <div class="empty-title">Nenhum colaborador encontrado</div>
        <p class="empty-desc">Verifique os termos da busca ou filtre por outro perfil.</p>
      </div>

      <!-- Modal Redefinir Senha -->
      <div class="modal-overlay" *ngIf="usuarioSelecionado">
        <div class="modal-content">
          <div class="card-title" style="margin-bottom: 8px;">
            🔑 Redefinir Senha de {{ usuarioSelecionado.nome }}
          </div>
          <p style="font-size: 13px; color: var(--muted); margin-bottom: 16px;">
            Defina uma nova senha para o colaborador.
          </p>

          <div class="form-group">
            <label>Nova Senha</label>
            <input
              type="password"
              [(ngModel)]="novaSenha"
              placeholder="Digite a nova senha..."
            />
          </div>

          <div class="form-actions" style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px;">
            <button class="btn btn-secondary" (click)="usuarioSelecionado = null">Cancelar</button>
            <button class="btn btn-primary" (click)="confirmarRedefinicao()" [disabled]="!novaSenha.trim() || actionLoading">
              Confirmar Nova Senha
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Importar Usuários -->
      <div class="modal-overlay" *ngIf="exibirModalImportacao">
        <div class="modal-content" style="max-width: 600px;">
          <div class="card-title" style="margin-bottom: 8px;">
            📥 Importar Colaboradores em Lote
          </div>
          <p style="font-size: 13px; color: var(--muted); margin-bottom: 16px;">
            Cole abaixo uma lista JSON de usuários para cadastrá-los em lote.
          </p>

          <div class="form-group">
            <label>JSON de Usuários</label>
            <textarea
              [(ngModel)]="jsonImportacao"
              rows="8"
              placeholder='[
  {
    "nome": "Carlos Silva",
    "email": "carlos@tvdiario.com",
    "username": "carlos",
    "password": "123",
    "departamento": "JORNALISMO",
    "usuarioTipo": "USER"
  }
]'
            ></textarea>
          </div>

          <div class="form-actions" style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px;">
            <button class="btn btn-secondary" (click)="exibirModalImportacao = false">Cancelar</button>
            <button class="btn btn-primary" (click)="processarImportacao()" [disabled]="!jsonImportacao.trim() || actionLoading">
              Importar Usuários
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-usuarios-page {
      animation: fadeIn 0.15s ease-out;
    }
    .page-header-actions {
      display: flex;
      gap: 8px;
    }
    .filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .search-box {
      flex: 1;
      max-width: 380px;
      min-width: 240px;
    }
    .user-row-info {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .user-name {
      font-weight: 600;
    }
    .badge-you {
      font-size: 10px;
      font-weight: 700;
      background: var(--success-lt);
      color: var(--success);
      padding: 1px 6px;
      border-radius: 4px;
      border: 1px solid var(--success-border);
    }
    .user-email {
      color: var(--muted);
      font-size: 12.5px;
    }
    .badge-ti {
      background: var(--purple-lt);
      color: var(--purple);
      border: 1px solid var(--purple-md);
    }
    .badge-user {
      background: var(--bg3);
      color: var(--muted);
      border: 1px solid var(--border);
    }
    .actions-group {
      display: inline-flex;
      gap: 6px;
    }
    .btn-delete {
      color: var(--danger);
    }
    .btn-delete:hover {
      background: var(--danger-lt);
    }
    .loading-box {
      text-align: center;
      padding: 40px;
      color: var(--muted);
    }
    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--border);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 12px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .empty-state {
      text-align: center;
      padding: 40px;
    }
    .empty-icon {
      font-size: 40px;
      margin-bottom: 8px;
    }
    .empty-title {
      font-size: 15px;
      font-weight: 700;
    }
    .empty-desc {
      font-size: 13px;
      color: var(--muted);
    }
    .pagination-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: var(--bg3);
      border-top: 1px solid var(--border);
      font-size: 12.5px;
      color: var(--muted);
      flex-wrap: wrap;
      gap: 8px;
    }
    .pag-buttons {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .pag-current {
      font-weight: 700;
      color: var(--text);
    }
  `]
})
export class AdminUsuariosComponent implements OnInit {
  authService = inject(AuthService);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  todosUsuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  usuariosPaginados: Usuario[] = [];
  loading = true;
  filtroTipo = 'TODOS';
  termoBusca = '';

  paginaAtual = 1;
  itensPorPagina = 25;
  totalPaginas = 1;

  usuarioSelecionado: Usuario | null = null;
  novaSenha = '';
  exibirModalImportacao = false;
  jsonImportacao = '';
  actionLoading = false;

  get totalTechs(): number {
    return this.todosUsuarios.filter((u) => u.usuarioTipo === 'TECH' || u.usuarioTipo === 'ADMIN').length;
  }

  get totalUsers(): number {
    return this.todosUsuarios.filter((u) => u.usuarioTipo === 'USER').length;
  }

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.userService.listar().subscribe({
      next: (users) => {
        try {
          this.todosUsuarios = Array.isArray(users) ? users : [];
          this.aplicarFiltro();
        } finally {
          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filtrarTipo(tipo: string): void {
    this.filtroTipo = tipo;
    this.paginaAtual = 1;
    this.aplicarFiltro();
  }

  aplicarFiltro(): void {
    let list = [...this.todosUsuarios];

    if (this.filtroTipo === 'TECH') {
      list = list.filter((u) => u.usuarioTipo === 'TECH' || u.usuarioTipo === 'ADMIN');
    } else if (this.filtroTipo === 'USER') {
      list = list.filter((u) => u.usuarioTipo === 'USER');
    }

    if (this.termoBusca.trim()) {
      const t = this.termoBusca.toLowerCase().trim();
      list = list.filter(
        (u) =>
          (u.nome ? String(u.nome).toLowerCase().includes(t) : false) ||
          (u.email ? String(u.email).toLowerCase().includes(t) : false) ||
          (u.departamento ? String(u.departamento).toLowerCase().includes(t) : false)
      );
    }

    this.usuariosFiltrados = list;
    this.totalPaginas = Math.ceil(list.length / this.itensPorPagina) || 1;
    this.atualizarPagina();
  }

  atualizarPagina(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.usuariosPaginados = this.usuariosFiltrados.slice(inicio, fim);
  }

  mudarPagina(p: number): void {
    if (p >= 1 && p <= this.totalPaginas) {
      this.paginaAtual = p;
      this.atualizarPagina();
    }
  }

  getFimPagina(): number {
    return Math.min(this.paginaAtual * this.itensPorPagina, this.usuariosFiltrados.length);
  }

  abrirModalRedefinir(u: Usuario): void {
    this.usuarioSelecionado = u;
    this.novaSenha = '';
  }

  confirmarRedefinicao(): void {
    if (!this.usuarioSelecionado?.id || !this.novaSenha.trim()) return;
    this.actionLoading = true;
    this.userService.redefinirSenha(this.usuarioSelecionado.id, this.novaSenha).subscribe({
      next: () => {
        alert('Senha redefinida com sucesso!');
        this.usuarioSelecionado = null;
        this.actionLoading = false;
      },
      error: () => {
        alert('Erro ao redefinir senha.');
        this.actionLoading = false;
      }
    });
  }

  excluirUsuario(u: Usuario): void {
    if (!u.id) return;
    if (confirm(`Tem certeza que deseja excluir o usuário ${u.nome}?`)) {
      this.userService.excluir(u.id).subscribe({
        next: () => {
          this.todosUsuarios = this.todosUsuarios.filter((x) => x.id !== u.id);
          this.aplicarFiltro();
        }
      });
    }
  }

  abrirModalImportar(): void {
    this.jsonImportacao = '';
    this.exibirModalImportacao = true;
  }

  processarImportacao(): void {
    try {
      const parsed = JSON.parse(this.jsonImportacao);
      if (!Array.isArray(parsed)) {
        alert('O JSON deve ser uma lista de usuários.');
        return;
      }
      this.actionLoading = true;
      this.userService.importar(parsed).subscribe({
        next: () => {
          alert('Usuários importados com sucesso!');
          this.exibirModalImportacao = false;
          this.actionLoading = false;
          this.carregarUsuarios();
        },
        error: () => {
          alert('Erro ao importar usuários. Verifique a formatação do JSON.');
          this.actionLoading = false;
        }
      });
    } catch {
      alert('JSON inválido. Por favor, verifique a sintaxe.');
    }
  }
}
