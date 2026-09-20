import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginDTO } from '../usuario/dto/loginDTO';
import { UsuarioResponseDTO } from '../usuario/dto/usuarioResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = '/api/auth';
  
  currentUser = signal<UsuarioResponseDTO | null>(null);

  constructor(private http: HttpClient) {}

  login(dto: LoginDTO): Observable<{ token: string; usuario: UsuarioResponseDTO }> {
    return this.http.post<{ token: string; usuario: UsuarioResponseDTO }>(`${this.baseUrl}/login`, dto).pipe(
      tap((res) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          this.currentUser.set(res.usuario);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUser() || !!localStorage.getItem('token');
  }

  isTechOrAdmin(): boolean {
    const user = this.currentUser();
    return user?.usuarioTipo === 'ADMINISTRADOR' || user?.usuarioTipo === 'TECNICO';
  }

  setUser(user: UsuarioResponseDTO | null): void {
    this.currentUser.set(user);
  }
  esqueciSenha(email: string): Observable<void> {
  return this.http.post<void>(`${this.baseUrl}/esqueci-senha`, { email });
}
}