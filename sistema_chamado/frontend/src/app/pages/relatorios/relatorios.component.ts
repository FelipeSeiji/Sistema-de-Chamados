import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Chamado } from '../../core/chamado/model/chamado';
import { CATEGORIAS_CONFIG, CategoriaInfo } from '../../core/usuario/model/constants/usuarioConstants';
import { ChamadoReaderService } from '../../core/chamado/service/chamadoReaderService';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {
  private chamadoReader = inject(ChamadoReaderService);

  chamados: Chamado[] = [];
  estatisticas: Record<string, number> = {};
  carregando = false;

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregando = true;

    this.chamadoReader.listar().subscribe({
      next: (dados: Chamado[]) => {
        this.chamados = dados;
        this.carregando = false;
      },
      error: (err: unknown) => {
        console.error('Erro ao carregar relatórios:', err);
        this.carregando = false;
      }
    });

    this.chamadoReader.obterEstatisticas().subscribe({
      next: (stats: Record<string, number>) => {
        this.estatisticas = stats;
      },
      error: (err: unknown) => {
        console.error('Erro ao carregar estatísticas:', err);
      }
    });
  }

  getCategoriaInfo(key: string): CategoriaInfo | undefined {
    return CATEGORIAS_CONFIG.find((x: CategoriaInfo) => (x.value as string) === key);
  }
}