import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// 1. Aponta para a pasta model/chamado (mesmo tipo retornado pelos serviços)
import { Chamado } from '../../core/chamado/model/chamado';
import { CategoriaChamado } from '../../core/chamado/enums/categoriaChamado';
import { MotivoDTO } from '../../core/chamado/dto/motivoDTO';

// Constantes e Interfaces de Usuário
import { CATEGORIAS_CONFIG, CategoriaInfo } from '../../core/usuario/model/constants/usuarioConstants';

// Serviços Granulares
import { AuthService } from '../../core/guards/auth.service';
import { ChamadoReaderService } from '../../core/chamado/service/chamadoReaderService';
import { ChamadoClientService } from '../../core/chamado/service/chamadoClientService';
import { ChamadoWorkflowService } from '../../core/chamado/service/chamadoWorkflowService';

@Component({
  selector: 'app-ver-chamado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ver-chamado.component.html',
  styleUrls: ['./ver-chamado.component.css']
})
export class VerChamadoComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  public authService = inject(AuthService);
  private chamadoReader = inject(ChamadoReaderService);
  private chamadoClient = inject(ChamadoClientService);
  private chamadoWorkflow = inject(ChamadoWorkflowService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  chamado?: Chamado;
  solucaoTexto = '';
  motivoTexto = '';
  mensagemErro = '';
  carregando = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarChamado(id);
    }
  }

  carregarChamado(id: string): void {
    this.carregando = true;
    this.chamadoReader.buscarPorId(id).subscribe({
      next: (c: Chamado) => {
        this.cdr.markForCheck();
        this.chamado = c;
        this.carregando = false;
      },
      error: (err: unknown) => {
        this.cdr.markForCheck();
        this.mensagemErro = (err as {error?: {message?: string}})?.error?.message ?? 'Não foi possível completar a ação. Verifique sua sessão e tente novamente.';
        this.carregando = false;
      }
    });
  }

  assumir(): void {
    if (!this.chamado?.id) return;
    this.chamadoWorkflow.assumir(this.chamado.id).subscribe({
      next: (atualizado: Chamado) => {
        this.cdr.markForCheck();
        this.chamado = atualizado;
      },
      error: (err: unknown) => { this.cdr.markForCheck(); this.mensagemErro = (err as {error?: {message?: string}})?.error?.message ?? 'Não foi possível completar a ação. Verifique sua sessão e tente novamente.'; }
    });
  }

  concluir(): void {
    if (!this.chamado?.id || !this.solucaoTexto) return;
    const dto: MotivoDTO = { motivo: this.solucaoTexto };
    this.chamadoWorkflow.concluir(this.chamado.id, dto).subscribe({
      next: (atualizado: Chamado) => {
        this.cdr.markForCheck();
        this.chamado = atualizado;
        this.solucaoTexto = '';
      },
      error: (err: unknown) => { this.cdr.markForCheck(); this.mensagemErro = (err as {error?: {message?: string}})?.error?.message ?? 'Não foi possível completar a ação. Verifique sua sessão e tente novamente.'; }
    });
  }

  reabrir(): void {
    if (!this.chamado?.id) return;
    const dto: MotivoDTO = { motivo: this.motivoTexto };
    this.chamadoWorkflow.reabrir(this.chamado.id, dto).subscribe({
      next: (atualizado: Chamado) => {
        this.cdr.markForCheck();
        this.chamado = atualizado;
        this.motivoTexto = '';
      },
      error: (err: unknown) => { this.cdr.markForCheck(); this.mensagemErro = (err as {error?: {message?: string}})?.error?.message ?? 'Não foi possível completar a ação. Verifique sua sessão e tente novamente.'; }
    });
  }

  cancelar(): void {
    if (!this.chamado?.id) return;
    const dto: MotivoDTO = { motivo: this.motivoTexto };
    this.chamadoClient.cancelar(this.chamado.id, dto).subscribe({
      next: (atualizado: Chamado) => {
        this.cdr.markForCheck();
        this.chamado = atualizado;
        this.motivoTexto = '';
      },
      error: (err: unknown) => { this.cdr.markForCheck(); this.mensagemErro = (err as {error?: {message?: string}})?.error?.message ?? 'Não foi possível completar a ação. Verifique sua sessão e tente novamente.'; }
    });
  }

  getCategoriaInfo(cat?: CategoriaChamado): CategoriaInfo | undefined {
    if (!cat) return undefined;
    return CATEGORIAS_CONFIG.find((c: CategoriaInfo) => (c.value as string) === (cat as string));
  }
}
