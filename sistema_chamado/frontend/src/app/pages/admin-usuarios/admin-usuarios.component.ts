import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UsuarioResponseDTO } from '../../core/usuario/dto/usuarioResponseDTO';
import { DEPARTAMENTOS_LIST } from '../../core/usuario/model/constants/usuarioConstants';

import { UserAdminService } from '../../core/usuario/service/usuarioAdminService';
import { UserSecurityService } from '../../core/usuario/service/usuarioSecurityService';
import { AuthService } from '../../core/guards/auth.service';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  public authService = inject(AuthService);
  private userAdminService = inject(UserAdminService);
  private userSecurityService = inject(UserSecurityService);

  usuarios: UsuarioResponseDTO[] = [];
  departamentos = DEPARTAMENTOS_LIST;
  mensagemErro = '';
  carregando = false;

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.carregando = true;
    this.userAdminService.listar().subscribe({
      next: (users: UsuarioResponseDTO[]) => {
        this.cdr.markForCheck();
        this.usuarios = users;
        this.carregando = false;
      },
      error: (err: unknown) => {
        this.cdr.markForCheck();
        this.mensagemErro = (err as {error?: {message?: string}})?.error?.message ?? 'Não foi possível completar a ação. Verifique sua sessão e tente novamente.';
        this.carregando = false;
      }
    });
  }

  solicitarSenha(id: string): void {
    const senha = prompt('Nova senha (6 a 72 caracteres):');
    if (senha && senha.length >= 6 && senha.length <= 72) this.redefinirSenha(id, senha);
  }
  excluir(id: string): void {
    if (confirm('Tem a certeza de que pretende eliminar este utilizador?')) {
      this.userAdminService.excluir(id).subscribe({
        next: () => this.carregarUsuarios(),
        error: (err: unknown) => { this.cdr.markForCheck(); this.mensagemErro = (err as {error?: {message?: string}})?.error?.message ?? 'Não foi possível completar a ação. Verifique sua sessão e tente novamente.'; }
      });
    }
  }

  redefinirSenha(id: string, novaSenha: string): void {
    if (!novaSenha) return;
    this.userSecurityService.redefinirSenha(id, novaSenha).subscribe({
      next: () => alert('Senha redefinida com sucesso!'),
      error: (err: unknown) => { this.cdr.markForCheck(); this.mensagemErro = (err as {error?: {message?: string}})?.error?.message ?? 'Não foi possível completar a ação. Verifique sua sessão e tente novamente.'; }
    });
  }
}
