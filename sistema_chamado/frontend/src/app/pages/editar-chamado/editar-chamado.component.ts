import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Chamado } from '../../core/chamado/model/chamado';
import { EditarChamadoDTO } from '../../core/chamado/dto/editarChamadoDTO';

import { CategoriaChamado } from '../../core/chamado/enums/categoriaChamado';
import { Prioridade } from '../../core/chamado/enums/prioridade';

import { CATEGORIAS_CONFIG } from '../../core/usuario/model/constants/usuarioConstants';

import { ChamadoReaderService } from '../../core/chamado/service/chamadoReaderService';
import { ChamadoClientService } from '../../core/chamado/service/chamadoClientService';

@Component({
  selector: 'app-editar-chamado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-chamado.component.html',
  styleUrls: ['./editar-chamado.component.css']
})
export class EditarChamadoComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private chamadoReader = inject(ChamadoReaderService);
  private chamadoClient = inject(ChamadoClientService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  chamadoId = '';
  titulo = '';
  descricao = '';
  categoria!: CategoriaChamado;
  prioridade!: Prioridade;
  categorias = CATEGORIAS_CONFIG;
  mensagemErro = '';
  carregando = false;

  ngOnInit(): void {
    this.chamadoId = this.route.snapshot.paramMap.get('id') || '';
    if (this.chamadoId) {
      this.carregando = true;
      this.chamadoReader.buscarPorId(this.chamadoId).subscribe({
        next: (c: Chamado) => {
        this.cdr.markForCheck();
          this.titulo = c.titulo;
          this.descricao = c.descricao;
          // Cast explícito para garantir compatibilidade caso algum DTO venha diferente
          this.categoria = c.categoria as CategoriaChamado;
          this.prioridade = c.prioridade as Prioridade;
          this.carregando = false;
        },
        error: (err: unknown) => {
        this.cdr.markForCheck();
          this.mensagemErro = (err as {error?: {message?: string}})?.error?.message ?? 'Não foi possível completar a ação. Verifique sua sessão e tente novamente.';
          this.carregando = false;
        }
      });
    }
  }

  salvar(): void {
    const dto: EditarChamadoDTO = {
      titulo: this.titulo,
      descricao: this.descricao,
      categoria: this.categoria,
      prioridade: this.prioridade
    };

    this.chamadoClient.editar(this.chamadoId, dto).subscribe({
      next: () => this.router.navigate(['/ver-chamado', this.chamadoId]),
      error: (err: unknown) => { this.cdr.markForCheck(); this.mensagemErro = (err as {error?: {message?: string}})?.error?.message ?? 'Não foi possível completar a ação. Verifique sua sessão e tente novamente.'; }
    });
  }
}
