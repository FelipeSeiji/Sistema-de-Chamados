import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
  private readonly cdr = inject(ChangeDetectorRef);
  private chamadoReader = inject(ChamadoReaderService);

  chamados: Chamado[] = [];
  estatisticas: Record<string, number> = {};
  mensagemErro = '';
  carregando = false;

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregando = true;

    this.chamadoReader.listar().subscribe({
      next: (dados: Chamado[]) => {
        this.cdr.markForCheck();
        this.chamados = dados;
        this.carregando = false;
      },
      error: (err: unknown) => {
        this.cdr.markForCheck();
        this.mensagemErro = (err as {error?: {message?: string}})?.error?.message ?? 'Não foi possível completar a ação. Verifique sua sessão e tente novamente.';
        this.carregando = false;
      }
    });

    this.chamadoReader.obterEstatisticas().subscribe({
      next: (stats: Record<string, number>) => {
        this.cdr.markForCheck();
        this.estatisticas = stats;
      },
      error: (err: unknown) => {
        this.cdr.markForCheck();
        this.mensagemErro = (err as {error?: {message?: string}})?.error?.message ?? 'Não foi possível completar a ação. Verifique sua sessão e tente novamente.';
      }
    });
  }

  getCategoriaInfo(key: string): CategoriaInfo | undefined {
    return CATEGORIAS_CONFIG.find((x: CategoriaInfo) => (x.value as string) === key);
  }
}
