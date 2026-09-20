import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/guards/auth.service';

@Component({
  selector: 'app-esqueci-senha',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './esqueci-senha.component.html',
  styleUrls: ['./esqueci-senha.component.css']
})
export class EsqueciSenhaComponent {
  private authService = inject(AuthService);

  email = '';
  mensagemSucesso = '';
  mensagemErro = '';
  carregando = false;

  enviarSolicitacao(): void {
    if (!this.email) {
      this.mensagemErro = 'Por favor, introduza o seu e-mail.';
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    this.authService.esqueciSenha(this.email).subscribe({
      next: () => {
        this.carregando = false;
        this.mensagemSucesso = 'Se o e-mail estiver cadastrado, receberá um link de redefinição em instantes.';
      },
      error: (err: unknown) => {
        this.carregando = false;
        this.mensagemSucesso = 'Se o e-mail estiver cadastrado, receberá um link de redefinição em instantes.';
        console.error('Erro ao solicitar redefinição de senha:', err);
      }
    });
  }
}