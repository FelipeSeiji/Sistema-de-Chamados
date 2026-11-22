import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CATEGORIAS_CONFIG } from '../../core/usuario/model/constants/usuarioConstants';
import { RouterModule } from '@angular/router';

import { Chamado } from '../../core/chamado/model/chamado';
import { ChamadoReaderService } from '../../core/chamado/service/chamadoReaderService';
import { AuthService } from '../../core/guards/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  public authService = inject(AuthService);
  private chamadoReader = inject(ChamadoReaderService);

  busca = '';
  statusFiltro = '';
  mensagemErro = '';
  contar(status: string): number { return this.chamados.filter(c => c.status === status).length; }
  categoriaLabel(value: string): string { return CATEGORIAS_CONFIG.find(c => c.value === value)?.label ?? value; }
  statusLabel(value: string): string { return ({ABERTO:'Aberto',EM_ATENDIMENTO:'Em atendimento',AGUARDANDO:'Aguardando',CONCLUIDO:'Concluído',CANCELADO:'Cancelado'} as Record<string,string>)[value] ?? value; }
  get filtrados(): Chamado[] {
    const query = this.busca.toLocaleLowerCase('pt-BR');
    return this.chamados.filter(c => (!this.statusFiltro || c.status === this.statusFiltro) && (c.titulo + ' ' + c.usuarioNome).toLocaleLowerCase('pt-BR').includes(query));
  }
  chamados: Chamado[] = [];
  carregando = false;

  ngOnInit(): void {
    this.carregarChamados();
  }

  carregarChamados(): void {
    this.carregando = true;
    this.mensagemErro = '';
    this.chamadoReader.listar().subscribe({
      next: (dados: Chamado[]) => {
        this.cdr.markForCheck();
        this.chamados = dados;
        this.carregando = false;
      },
      error: (err: unknown) => {
        this.cdr.markForCheck();
        this.mensagemErro = 'Não foi possível carregar os chamados. Atualize a página ou entre novamente.';
        this.carregando = false;
      }
    });
  }
}
