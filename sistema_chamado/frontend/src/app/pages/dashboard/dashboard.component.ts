import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ChamadoService } from '../../core/services/chamado.service';
import { Chamado, StatusChamado, CATEGORIAS_CONFIG } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="dashboard-page" *ngIf="authService.currentUser() as user">
      <!-- Header -->
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">
            {{ isTech ? 'Painel de Suporte — TI & Engenharia' : 'Meus Chamados' }}
          </div>
          <div class="page-sub">
            {{ isTech ? 'Visão consolidada de todas as solicitações da empresa' : 'Acompanhe o andamento dos chamados abertos por você' }}
          </div>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-ghost btn-sm" (click)="carregarChamados()" title="Atualizar dados">
            🔄 Atualizar
          </button>
          <a routerLink="/chamados/novo" class="btn btn-primary">
            ➕ Abrir Chamado
          </a>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card" [class.active]="filtroStatus === 'TODOS'" (click)="filtrarStatus('TODOS')">
          <div class="stat-icon blue">📋</div>
          <div>
            <div class="stat-val">{{ stats.total }}</div>
            <div class="stat-label">Total de Chamados</div>
          </div>
        </div>

        <div class="stat-card" [class.active]="filtroStatus === 'ABERTO'" (click)="filtrarStatus('ABERTO')">
          <div class="stat-icon amber">⏳</div>
          <div>
            <div class="stat-val">{{ stats.abertos }}</div>
            <div class="stat-label">Aguardando Atendimento</div>
          </div>
        </div>

        <div class="stat-card" [class.active]="filtroStatus === 'EM_ATENDIMENTO'" (click)="filtrarStatus('EM_ATENDIMENTO')">
          <div class="stat-icon purple">⚙️</div>
          <div>
            <div class="stat-val">{{ stats.emAtendimento }}</div>
            <div class="stat-label">Em Atendimento</div>
          </div>
        </div>

        <div class="stat-card" [class.active]="filtroStatus === 'CONCLUIDO'" (click)="filtrarStatus('CONCLUIDO')">
          <div class="stat-icon green">✅</div>
          <div>
            <div class="stat-val">{{ stats.concluidos }}</div>
            <div class="stat-label">Resolvidos</div>
          </div>
        </div>
      </div>

      <!-- Filtros e Busca -->
      <div class="filter-bar">
        <div class="filter-tabs">
          <button
            class="btn btn-ghost btn-sm"
            [class.active]="filtroStatus === 'TODOS'"
            (click)="filtrarStatus('TODOS')"
          >
            Todos ({{ stats.total }})
          </button>
          <button
            class="btn btn-ghost btn-sm"
            [class.active]="filtroStatus === 'ABERTO'"
            (click)="filtrarStatus('ABERTO')"
          >
            Abertos ({{ stats.abertos }})
          </button>
          <button
            class="btn btn-ghost btn-sm"
            [class.active]="filtroStatus === 'EM_ATENDIMENTO'"
            (click)="filtrarStatus('EM_ATENDIMENTO')"
          >
            Em Atendimento ({{ stats.emAtendimento }})
          </button>
          <button
            class="btn btn-ghost btn-sm"
            [class.active]="filtroStatus === 'CONCLUIDO'"
            (click)="filtrarStatus('CONCLUIDO')"
          >
            Concluídos ({{ stats.concluidos }})
          </button>
        </div>

        <div class="search-box">
          <input
            type="text"
            [(ngModel)]="termoBusca"
            (input)="aplicarFiltro()"
            placeholder="🔍 Buscar por título, autor, departamento, área..."
          />
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-box card">
        <div class="spinner"></div>
        <p>Carregando chamados...</p>
      </div>

      <!-- Tabela de Chamados -->
      <div class="table-wrap" *ngIf="!loading && chamadosPaginados.length > 0">
        <table>
          <thead>
            <tr>
              <th (click)="ordenar('id')" class="sortable">
                # <span class="sort-icon">{{ getSortIcon('id') }}</span>
              </th>
              <th (click)="ordenar('titulo')" class="sortable">
                Chamado <span class="sort-icon">{{ getSortIcon('titulo') }}</span>
              </th>
              <th *ngIf="isTech" (click)="ordenar('solicitante')" class="sortable">
                Solicitante <span class="sort-icon">{{ getSortIcon('solicitante') }}</span>
              </th>
              <th (click)="ordenar('categoria')" class="sortable">
                Área / Categoria <span class="sort-icon">{{ getSortIcon('categoria') }}</span>
              </th>
              <th (click)="ordenar('prioridade')" class="sortable">
                Prioridade <span class="sort-icon">{{ getSortIcon('prioridade') }}</span>
              </th>
              <th (click)="ordenar('status')" class="sortable">
                Status <span class="sort-icon">{{ getSortIcon('status') }}</span>
              </th>
              <th (click)="ordenar('criadoEm')" class="sortable">
                Aberto em <span class="sort-icon">{{ getSortIcon('criadoEm') }}</span>
              </th>
              <th style="text-align: right;">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of chamadosPaginados; trackBy: trackById">
              <td class="chamado-id">
                <a [routerLink]="['/chamados', c.id]">
                  #{{ (c.id || '').substring(0, 6) }}
                </a>
              </td>
              <td>
                <a [routerLink]="['/chamados', c.id]" class="chamado-link-title">
                  {{ c.titulo || 'Sem título' }}
                </a>
                <div class="chamado-desc-preview">{{ getPreviewDesc(c.descricao) }}</div>
              </td>
              <td *ngIf="isTech">
                <div class="user-cell">
                  <span class="user-cell-name">{{ c.usuario?.nome || '—' }}</span>
                  <span class="user-cell-dept">{{ c.usuario?.departamento || '' }}</span>
                </div>
              </td>
              <td>
                <span class="category-tag">
                  {{ formatarCategoria(c.categoria) }}
                </span>
              </td>
              <td>
                <span class="badge badge-{{ c.prioridade || 'MEDIA' }}">
                  {{ c.prioridade || 'NORMAL' }}
                </span>
              </td>
              <td>
                <span class="badge badge-{{ c.status || 'ABERTO' }}">
                  {{ formatarStatus(c.status) }}
                </span>
              </td>
              <td class="chamado-date">
                {{ formatarData(c.criadoEm) }}
              </td>
              <td style="text-align: right;">
                <div class="actions-cell">
                  <button
                    *ngIf="isTech && c.status === 'ABERTO'"
                    class="btn btn-sm btn-success"
                    (click)="assumirChamado(c, $event)"
                    title="Assumir Chamado"
                  >
                    ✋ Assumir
                  </button>
                  <a [routerLink]="['/chamados', c.id]" class="btn btn-sm btn-ghost">
                    Ver detalhes →
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Paginação -->
        <div class="pagination-bar" *ngIf="totalPaginas > 1">
          <span class="pag-info">
            Mostrando {{ (paginaAtual - 1) * itensPorPagina + 1 }} a {{ getFimPagina() }} de {{ chamadosFiltrados.length }} chamados
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
      <div *ngIf="!loading && chamadosFiltrados.length === 0" class="empty-state card">
        <div class="empty-icon">📭</div>
        <div class="empty-title">Nenhum chamado encontrado</div>
        <p class="empty-desc">
          {{ termoBusca ? 'Nenhum resultado corresponde à sua pesquisa.' : 'Não há registros com os filtros selecionados.' }}
        </p>
        <a routerLink="/chamados/novo" class="btn btn-primary" style="margin-top: 12px;">
          ➕ Abrir Primeiro Chamado
        </a>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
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
    .filter-tabs {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .search-box {
      flex: 1;
      max-width: 380px;
      min-width: 240px;
    }
    .search-box input {
      padding: 8px 14px;
      font-size: 13px;
    }
    .chamado-id a {
      font-weight: 700;
      color: var(--muted);
      font-family: monospace;
      font-size: 13px;
    }
    .chamado-link-title {
      font-weight: 600;
      color: var(--text);
      display: block;
    }
    .chamado-link-title:hover {
      color: var(--accent);
    }
    .chamado-desc-preview {
      font-size: 12px;
      color: var(--muted);
      margin-top: 2px;
    }
    .user-cell {
      line-height: 1.25;
    }
    .user-cell-name {
      font-weight: 600;
      font-size: 13px;
      display: block;
    }
    .user-cell-dept {
      font-size: 11.5px;
      color: var(--muted);
    }
    .category-tag {
      font-size: 12px;
      color: var(--text);
      background: var(--bg3);
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid var(--border);
      white-space: nowrap;
    }
    .chamado-date {
      font-size: 12.5px;
      color: var(--muted);
      white-space: nowrap;
    }
    .sortable {
      cursor: pointer;
      user-select: none;
    }
    .sortable:hover {
      color: var(--text);
    }
    .sort-icon {
      font-size: 10px;
      margin-left: 4px;
    }
    .actions-cell {
      display: inline-flex;
      gap: 6px;
      align-items: center;
    }
    .loading-box {
      text-align: center;
      padding: 48px;
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
      padding: 48px 24px;
    }
    .empty-icon {
      font-size: 44px;
      margin-bottom: 8px;
    }
    .empty-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--text);
    }
    .empty-desc {
      font-size: 13px;
      color: var(--muted);
      margin-top: 4px;
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
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  private chamadoService = inject(ChamadoService);
  private cdr = inject(ChangeDetectorRef);

  todosChamados: Chamado[] = [];
  chamadosFiltrados: Chamado[] = [];
  chamadosPaginados: Chamado[] = [];
  loading = true;

  filtroStatus: string = 'TODOS';
  termoBusca = '';

  sortColumn = 'criadoEm';
  sortDirection: 'asc' | 'desc' = 'desc';

  paginaAtual = 1;
  itensPorPagina = 25;
  totalPaginas = 1;

  stats = {
    total: 0,
    abertos: 0,
    emAtendimento: 0,
    concluidos: 0
  };

  get isTech(): boolean {
    return this.authService.isTechOrAdmin();
  }

  ngOnInit(): void {
    this.carregarChamados();
  }

  carregarChamados(): void {
    this.loading = true;
    this.cdr.markForCheck();
    const user = this.authService.currentUser();
    if (!user) {
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    const stream$ = this.isTech
      ? this.chamadoService.listar()
      : (user.id ? this.chamadoService.listarPorUsuario(user.id) : this.chamadoService.listar());

    stream$.subscribe({
      next: (dados) => {
        try {
          this.todosChamados = Array.isArray(dados) ? dados : [];
          this.calcularStats(this.todosChamados);
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

  calcularStats(chamados: Chamado[]) {
    this.stats.total = chamados.length;
    this.stats.abertos = chamados.filter((c) => c.status === 'ABERTO').length;
    this.stats.emAtendimento = chamados.filter(
      (c) => c.status === 'EM_ATENDIMENTO' || c.status === 'AGUARDANDO'
    ).length;
    this.stats.concluidos = chamados.filter((c) => c.status === 'CONCLUIDO').length;
  }

  filtrarStatus(status: string) {
    this.filtroStatus = status;
    this.paginaAtual = 1;
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    let filtrados = [...this.todosChamados];

    if (this.filtroStatus !== 'TODOS') {
      filtrados = filtrados.filter((c) => c.status === this.filtroStatus);
    }

    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.toLowerCase().trim();
      filtrados = filtrados.filter((c) => {
        const idMatch = c.id ? String(c.id).toLowerCase().includes(termo) : false;
        const titMatch = c.titulo ? String(c.titulo).toLowerCase().includes(termo) : false;
        const descMatch = c.descricao ? String(c.descricao).toLowerCase().includes(termo) : false;
        const catMatch = c.categoria ? String(c.categoria).toLowerCase().includes(termo) : false;
        const usrMatch = c.usuario?.nome ? String(c.usuario.nome).toLowerCase().includes(termo) : false;
        const depMatch = c.usuario?.departamento ? String(c.usuario.departamento).toLowerCase().includes(termo) : false;
        return idMatch || titMatch || descMatch || catMatch || usrMatch || depMatch;
      });
    }

    this.ordenarLista(filtrados);
    this.chamadosFiltrados = filtrados;
    this.totalPaginas = Math.ceil(filtrados.length / this.itensPorPagina) || 1;
    this.atualizarPagina();
  }

  atualizarPagina() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.chamadosPaginados = this.chamadosFiltrados.slice(inicio, fim);
  }

  mudarPagina(p: number) {
    if (p >= 1 && p <= this.totalPaginas) {
      this.paginaAtual = p;
      this.atualizarPagina();
    }
  }

  getFimPagina(): number {
    return Math.min(this.paginaAtual * this.itensPorPagina, this.chamadosFiltrados.length);
  }

  getPreviewDesc(desc?: string | null): string {
    if (!desc) return '';
    const clean = desc.replace(/\n+/g, ' ');
    return clean.length > 70 ? clean.substring(0, 70) + '...' : clean;
  }

  ordenar(coluna: string) {
    if (this.sortColumn === coluna) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = coluna;
      this.sortDirection = 'asc';
    }
    this.paginaAtual = 1;
    this.aplicarFiltro();
  }

  ordenarLista(lista: Chamado[]) {
    lista.sort((a, b) => {
      let valA: any = '';
      let valB: any = '';

      switch (this.sortColumn) {
        case 'id':
          valA = a.id || '';
          valB = b.id || '';
          break;
        case 'titulo':
          valA = a.titulo || '';
          valB = b.titulo || '';
          break;
        case 'solicitante':
          valA = a.usuario?.nome || '';
          valB = b.usuario?.nome || '';
          break;
        case 'categoria':
          valA = a.categoria || '';
          valB = b.categoria || '';
          break;
        case 'prioridade':
          valA = a.prioridade || '';
          valB = b.prioridade || '';
          break;
        case 'status':
          valA = a.status || '';
          valB = b.status || '';
          break;
        case 'criadoEm':
        default:
          valA = a.criadoEm || '';
          valB = b.criadoEm || '';
          break;
      }

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getSortIcon(coluna: string): string {
    if (this.sortColumn !== coluna) return '↕';
    return this.sortDirection === 'asc' ? '▲' : '▼';
  }

  assumirChamado(chamado: Chamado, event: Event) {
    event.stopPropagation();
    if (!chamado.id) return;
    this.chamadoService.assumir(chamado.id).subscribe({
      next: (atualizado) => {
        chamado.status = atualizado.status;
        this.calcularStats(this.todosChamados);
        this.aplicarFiltro();
      }
    });
  }

  formatarCategoria(cat: string): string {
    if (!cat) return '—';
    const config = CATEGORIAS_CONFIG.find((c) => c.value === cat);
    return config ? `${config.icone} ${config.label}` : cat;
  }

  formatarStatus(status?: StatusChamado): string {
    if (!status) return '—';
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
      // Se for formato ISO simples
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

  trackById(index: number, item: Chamado): string {
    return item.id || String(index);
  }
}
