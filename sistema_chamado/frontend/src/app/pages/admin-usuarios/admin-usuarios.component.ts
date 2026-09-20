import { Component, OnInit, inject } from '@angular/core';
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
  public authService = inject(AuthService);
  private userAdminService = inject(UserAdminService);
  private userSecurityService = inject(UserSecurityService);

  usuarios: UsuarioResponseDTO[] = [];
  departamentos = DEPARTAMENTOS_LIST;
  carregando = false;

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.carregando = true;
    this.userAdminService.listar().subscribe({
      next: (users: UsuarioResponseDTO[]) => {
        this.usuarios = users;
        this.carregando = false;
      },
      error: (err: unknown) => {
        console.error('Erro ao carregar utilizadores:', err);
        this.carregando = false;
      }
    });
  }

  excluir(id: string): void {
    if (confirm('Tem a certeza de que pretende eliminar este utilizador?')) {
      this.userAdminService.excluir(id).subscribe({
        next: () => this.carregarUsuarios(),
        error: (err: unknown) => console.error('Erro ao eliminar utilizador:', err)
      });
    }
  }

  redefinirSenha(id: string, novaSenha: string): void {
    if (!novaSenha) return;
    this.userSecurityService.redefinirSenha(id, novaSenha).subscribe({
      next: () => alert('Senha redefinida com sucesso!'),
      error: (err: unknown) => console.error('Erro ao redefinir senha:', err)
    });
  }
}