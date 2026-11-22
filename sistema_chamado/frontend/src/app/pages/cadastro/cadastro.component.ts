import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { CriarUsuarioDTO } from '../../core/usuario/dto/criarUsuarioDTO';
import { UsuarioResponseDTO } from '../../core/usuario/dto/usuarioResponseDTO';
import { Departamento } from '../../core/usuario/model/enums/usuarioDepartamento';
import { UsuarioTipo } from '../../core/usuario/model/enums/usuarioTipo';

import { DEPARTAMENTOS_LIST } from '../../core/usuario/model/constants/usuarioConstants';

import { UserAdminService } from '../../core/usuario/service/usuarioAdminService';
import { AuthService } from '../../core/guards/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  private readonly cdr = inject(ChangeDetectorRef);
  private userAdminService = inject(UserAdminService);
  private authService = inject(AuthService);
  private router = inject(Router);

  nome = '';
  username = '';
  email = '';
  password = '';
  departamento: Departamento = 'JORNALISMO';
  usuarioTipo: UsuarioTipo = 'USUARIO';

  departamentos = DEPARTAMENTOS_LIST;
  mensagemErro = '';
  carregando = false;

  cadastrar(): void {
    if (!this.nome || !this.email || !this.password || !this.username) {
      this.mensagemErro = 'Preencha todos os campos obrigatórios.';
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';

    const dto: CriarUsuarioDTO = {
      nome: this.nome,
      username: this.username,
      email: this.email,
      password: this.password,
      departamento: this.departamento,
      usuarioTipo: this.usuarioTipo
    };

    this.userAdminService.criar(dto).subscribe({
      next: (novoUsuario: UsuarioResponseDTO) => {
        this.cdr.markForCheck();
        this.carregando = false;
        this.router.navigate(['/login']);
      },
      error: (err: unknown) => {
        this.cdr.markForCheck();
        this.carregando = false;
        this.mensagemErro = 'Erro ao realizar cadastro. Verifique os dados introduzidos.';
        console.error('Erro no cadastro:', err);
      }
    });
  }
}
