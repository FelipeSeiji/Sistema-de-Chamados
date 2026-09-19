import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChamadoService } from '../../core/services/chamado.service';
import { Chamado, CATEGORIAS_CONFIG } from '../../core/models/models';

interface StatBarra {
  label: string;
  total: number;
  porcentagem: number;
}

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="relatorios-page">
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">📈 Relatórios Gerenciais</div>
          <div class="page-sub">Visão analítica dos chamados e métricas de atendimento — TV Diário</div>
        </div>
        <button class="btn btn-primary" (click)="exportarCSV()">
          📥 Exportar CSV para Excel/BI
        </button>
      </div>

      <!-- Filtro de Período -->
      <div class="periodo-bar card">
        <span class="periodo-title">Período de Análise:</span>
        <div class="periodo-buttons">
          <button
            *ngFor="let p of periodos"
            class="btn btn-sm"
            [ngClass]="periodoSelecionado === p.dias ? 'btn-primary' : 'btn-ghost'"
            (click)="selecionarPeriodo(p.dias)"
          >
            {{ p.label }}
          </button>
        </div>
        <span class="periodo-total">
          <strong>{{ chamadosPeriodo.length }}</strong> chamados no período
        </span>
      </div>

      <!-- KPIs em Destaque -->
      <div class="kpi-grid">
        <div class="kpi-card blue">
          <div class="kpi-val">{{ kpis.abertos }}</div>
          <div class="kpi-label">Abertos Agora</div>
        </div>
        <div class="kpi-card purple">
          <div class="kpi-val">{{ kpis.emAtendimento }}</div>
          <div class="kpi-label">Em Atendimento</div>
        </div>
        <div class="kpi-card green">
          <div class="kpi-val">{{ kpis.concluidos }}</div>
          <div class="kpi-label">Concluídos / Resolvidos</div>
        </div>
        <div class="kpi-card red">
          <div class="kpi-val">{{ kpis.cancelados }}</div>
          <div class="kpi-label">Cancelados</div>
        </div>
      </div>

      <!-- Distribuição por Categoria & Departamento -->
      <div class="charts-grid">
        <!-- Por Área / Categoria -->
        <div class="card chart-card">
          <div class="chart-title">📍 Chamados por Área / Categoria</div>
          <div *ngIf="porCategoria.length === 0" class="empty-chart">Sem dados no período</div>
          <div class="bars-container" *ngFor="let item of porCategoria">
            <div class="bar-header">
              <span class="bar-label">{{ item.label }}</span>
              <span class="bar-val">{{ item.total }} ({{ item.porcentagem | number:'1.0-0' }}%)</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill blue" [style.width.%]="item.porcentagem"></div>
            </div>
          </div>
        </div>

        <!-- Por Departamento -->
        <div class="card chart-card">
          <div class="chart-title">🏢 Chamados por Departamento Solicitante</div>
          <div *ngIf="porDepartamento.length === 0" class="empty-chart">Sem dados no período</div>
          <div class="bars-container" *ngFor="let item of porDepartamento">
            <div class="bar-header">
              <span class="bar-label">{{ item.label }}</span>
              <span class="bar-val">{{ item.total }} ({{ item.porcentagem | number:'1.0-0' }}%)</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill purple" [style.width.%]="item.porcentagem"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .relatorios-page {
      animation: fadeIn 0.15s ease-out;
    }
    .periodo-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 20px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .periodo-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--text);
    }
    .periodo-buttons {
      display: flex;
      gap: 6px;
    }
    .periodo-total {
      margin-left: auto;
      font-size: 13px;
      color: var(--muted);
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .kpi-card {
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px 22px;
      box-shadow: var(--shadow-sm);
      position: relative;
      overflow: hidden;
    }
    .kpi-card::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 4px;
    }
    .kpi-card.blue::after { background: var(--accent); }
    .kpi-card.purple::after { background: var(--purple); }
    .kpi-card.green::after { background: var(--success); }
    .kpi-card.red::after { background: var(--danger); }
    .kpi-val {
      font-size: 32px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: -1px;
    }
    .kpi-card.blue .kpi-val { color: var(--accent); }
    .kpi-card.purple .kpi-val { color: var(--purple); }
    .kpi-card.green .kpi-val { color: var(--success); }
    .kpi-card.red .kpi-val { color: var(--danger); }
    .kpi-label {
      font-size: 12.5px;
      color: var(--muted);
      margin-top: 6px;
      font-weight: 600;
    }
    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .chart-card {
      padding: 22px;
    }
    .chart-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--text);
      margin-bottom: 20px;
    }
    .bars-container {
      margin-bottom: 14px;
    }
    .bar-header {
      display: flex;
      justify-content: space-between;
      font-size: 12.5px;
      margin-bottom: 5px;
    }
    .bar-label {
      font-weight: 600;
      color: var(--text);
    }
    .bar-val {
      font-weight: 600;
      color: var(--muted);
    }
    .bar-track {
      height: 9px;
      background: var(--bg3);
      border-radius: 6px;
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      border-radius: 6px;
      transition: width 0.3s ease;
    }
    .bar-fill.blue { background: var(--accent); }
    .bar-fill.purple { background: var(--purple); }
    .empty-chart {
      text-align: center;
      padding: 30px;
      color: var(--muted);
      font-size: 13px;
    }
    @media (max-width: 800px) {
      .charts-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RelatoriosComponent implements OnInit {
  private chamadoService = inject(ChamadoService);
  private cdr = inject(ChangeDetectorRef);

  todosChamados: Chamado[] = [];
  chamadosPeriodo: Chamado[] = [];
  periodoSelecionado = 30;

  periodos = [
    { dias: 7, label: '7 dias' },
    { dias: 15, label: '15 dias' },
    { dias: 30, label: '30 dias' },
    { dias: 60, label: '60 dias' },
    { dias: 90, label: '90 dias' },
    { dias: 365, label: '1 ano' }
  ];

  kpis = {
    abertos: 0,
    emAtendimento: 0,
    concluidos: 0,
    cancelados: 0
  };

  porCategoria: StatBarra[] = [];
  porDepartamento: StatBarra[] = [];

  ngOnInit(): void {
    this.chamadoService.listar().subscribe({
      next: (dados) => {
        this.todosChamados = Array.isArray(dados) ? dados : [];
        this.processarDados();
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      }
    });
  }

  selecionarPeriodo(dias: number): void {
    this.periodoSelecionado = dias;
    this.processarDados();
    this.cdr.detectChanges();
  }

  processarDados(): void {
    const limiteData = new Date();
    limiteData.setDate(limiteData.getDate() - this.periodoSelecionado);

    this.chamadosPeriodo = this.todosChamados.filter((c) => {
      if (!c.criadoEm) return true;
      try {
        const dt = new Date(c.criadoEm);
        return isNaN(dt.getTime()) || dt >= limiteData;
      } catch {
        return true;
      }
    });

    // KPIs
    this.kpis.abertos = this.chamadosPeriodo.filter((c) => c.status === 'ABERTO').length;
    this.kpis.emAtendimento = this.chamadosPeriodo.filter(
      (c) => c.status === 'EM_ATENDIMENTO' || c.status === 'AGUARDANDO'
    ).length;
    this.kpis.concluidos = this.chamadosPeriodo.filter((c) => c.status === 'CONCLUIDO').length;
    this.kpis.cancelados = this.chamadosPeriodo.filter((c) => c.status === 'CANCELADO').length;

    // Por Categoria
    const mapCat: Record<string, number> = {};
    this.chamadosPeriodo.forEach((c) => {
      const cat = c.categoria || 'OUTROS';
      mapCat[cat] = (mapCat[cat] || 0) + 1;
    });

    const total = this.chamadosPeriodo.length || 1;
    this.porCategoria = Object.keys(mapCat).map((key) => {
      const config = CATEGORIAS_CONFIG.find((x) => x.value === key);
      const label = config ? `${config.icone} ${config.label}` : key;
      const qtd = mapCat[key];
      return {
        label,
        total: qtd,
        porcentagem: (qtd / total) * 100
      };
    }).sort((a, b) => b.total - a.total);

    // Por Departamento
    const mapDep: Record<string, number> = {};
    this.chamadosPeriodo.forEach((c) => {
      const dep = c.usuario?.departamento || 'NÃO INFORMADO';
      mapDep[dep] = (mapDep[dep] || 0) + 1;
    });

    this.porDepartamento = Object.keys(mapDep).map((key) => {
      const qtd = mapDep[key];
      return {
        label: key,
        total: qtd,
        porcentagem: (qtd / total) * 100
      };
    }).sort((a, b) => b.total - a.total);
  }

  exportarCSV(): void {
    if (this.chamadosPeriodo.length === 0) {
      alert('Não há dados para exportar no período.');
      return;
    }

    const colunas = ['ID', 'Titulo', 'Categoria', 'Prioridade', 'Status', 'Solicitante', 'Departamento', 'CriadoEm', 'Solucao'];
    const linhas = this.chamadosPeriodo.map((c) => [
      `"${c.id || ''}"`,
      `"${(c.titulo || '').replace(/"/g, '""')}"`,
      `"${c.categoria || ''}"`,
      `"${c.prioridade || ''}"`,
      `"${c.status || ''}"`,
      `"${(c.usuario?.nome || '').replace(/"/g, '""')}"`,
      `"${c.usuario?.departamento || ''}"`,
      `"${c.criadoEm || ''}"`,
      `"${(c.solucao || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [colunas.join(';'), ...linhas.map((e) => e.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_chamados_tvdiario_${this.periodoSelecionado}dias.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
