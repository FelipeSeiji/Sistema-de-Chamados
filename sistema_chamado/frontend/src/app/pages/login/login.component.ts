import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { LoginDTO } from '../../core/usuario/dto/loginDTO';
import { AuthService } from '../../core/guards/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private readonly cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  senha = '';
  mensagemErro = '';
  carregando = false;

  entrar(): void {
    if (!this.email || !this.senha) {
      this.mensagemErro = 'Por favor, preencha o e-mail e a senha.';
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';

    const dto: LoginDTO = {
      email: this.email,
      senha: this.senha
    };

    this.authService.login(dto).subscribe({
      next: () => {
        this.cdr.markForCheck();
        this.carregando = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err: unknown) => {
        this.cdr.markForCheck();
        this.carregando = false;
        this.mensagemErro = 'E-mail ou senha incorretos.';
        console.error('Erro ao efetuar login:', err);
      }
    });
  }
}
