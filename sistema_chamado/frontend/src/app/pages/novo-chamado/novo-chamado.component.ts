import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CriarChamadoDTO } from '../../core/chamado/dto/criarChamadoDTO';
import { UsuarioResponseDTO } from '../../core/usuario/dto/usuarioResponseDTO';

import { CategoriaChamado } from '../../core/chamado/enums/categoriaChamado';
import { Prioridade } from '../../core/chamado/enums/prioridade';

import { CATEGORIAS_CONFIG, CategoriaInfo } from '../../core/usuario/model/constants/usuarioConstants';

import { AuthService } from '../../core/guards/auth.service';
import { ChamadoClientService } from '../../core/chamado/service/chamadoClientService';
import { UserAdminService } from '../../core/usuario/service/usuarioAdminService';

@Component({
  selector: 'app-novo-chamado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './novo-chamado.component.html',
  styleUrls: ['./novo-chamado.component.css']
})
export class NovoChamadoComponent implements OnInit {
  public authService = inject(AuthService);
  private chamadoClient = inject(ChamadoClientService);
  private userAdminService = inject(UserAdminService);
  private router = inject(Router);

  titulo = '';
  descricao = '';
  categoria: CategoriaChamado = 'HARDWARE' as CategoriaChamado;
  prioridade: Prioridade = 'NORMAL' as Prioridade;
  
  usuarioSolicitanteId = '';

  usuarios: UsuarioResponseDTO[] = [];
  categorias = CATEGORIAS_CONFIG;
  mensagemErro = '';
  carregando = false;

  ngOnInit(): void {
    const user = this.authService.currentUser();
    
    if (this.authService.isTechOrAdmin()) {
      this.userAdminService.listar().subscribe({
        next: (users: UsuarioResponseDTO[]) => {
          this.usuarios = users;
        },
        error: (err: unknown) => console.error('Erro ao carregar lista de usuários:', err)
      });
    } else if (user) {
      this.usuarioSolicitanteId = user.id || '';
    }
  }

  criarChamado(): void {
    if (!this.titulo || !this.descricao) {
      this.mensagemErro = 'Preencha o título e a descrição do chamado.';
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';

    const dto: CriarChamadoDTO = {
      titulo: this.titulo,
      descricao: this.descricao,
      categoria: this.categoria,
      prioridade: this.prioridade
    };

    this.chamadoClient.abrirChamado(dto, this.usuarioSolicitanteId).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err: unknown) => {
        this.carregando = false;
        this.mensagemErro = 'Erro ao abrir o chamado. Tente novamente.';
        console.error('Erro ao abrir chamado:', err);
      }
    });
  }

  getCategoriaInfo(cat: CategoriaChamado): CategoriaInfo | undefined {
    return CATEGORIAS_CONFIG.find((c: CategoriaInfo) => (c.value as string) === (cat as string));
  }
}