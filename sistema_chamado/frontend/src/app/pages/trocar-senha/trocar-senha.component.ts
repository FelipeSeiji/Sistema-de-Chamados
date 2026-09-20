import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TrocarSenhaDTO } from '../../core/usuario/dto/trocarSenhaDTO';
import { AuthService } from '../../core/guards/auth.service';
import { UserSecurityService } from '../../core/usuario/service/usuarioSecurityService';

@Component({
  selector: 'app-trocar-senha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trocar-senha.component.html',
  styleUrls: ['./trocar-senha.component.css']
})
export class TrocarSenhaComponent {
  private authService = inject(AuthService);
  private userSecurityService = inject(UserSecurityService);
  private router = inject(Router);

  senhaAtual = '';
  novaSenha = '';
  mensagemErro = '';
  carregando = false;

  salvar(): void {
    const user = this.authService.currentUser();
    if (!user?.id) {
      this.mensagemErro = 'Utilizador não autenticado.';
      return;
    }

    if (!this.senhaAtual || !this.novaSenha) {
      this.mensagemErro = 'Preencha todos os campos de senha.';
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';

    const dto: TrocarSenhaDTO = {
      senhaAtual: this.senhaAtual,
      novaSenha: this.novaSenha
    };

    this.userSecurityService.trocarSenha(user.id, dto).subscribe({
      next: () => {
        this.carregando = false;
        alert('Senha alterada com sucesso!');
        this.router.navigate(['/dashboard']);
      },
      error: (err: unknown) => {
        this.carregando = false;
        this.mensagemErro = 'Erro ao alterar a senha. Verifique se a senha atual está correta.';
        console.error('Erro ao trocar senha:', err);
      }
    });
  }
}