import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom, switchMap, tap } from 'rxjs';
import { LoginDTO } from '../usuario/dto/loginDTO';
import { UsuarioResponseDTO } from '../usuario/dto/usuarioResponseDTO';
@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly baseUrl = '/api/v1/auth';
  currentUser = signal<UsuarioResponseDTO | null>(null);
  constructor(private http: HttpClient) {}
  async initialize(): Promise<void> {
    await firstValueFrom(this.http.get(this.baseUrl + '/csrf'));
    try { this.currentUser.set(await firstValueFrom(this.http.get<UsuarioResponseDTO>(this.baseUrl + '/me'))); }
    catch { this.currentUser.set(null); }
  }
  login(dto: LoginDTO): Observable<UsuarioResponseDTO> {
    return this.http.get(this.baseUrl + '/csrf').pipe(
      switchMap(() => this.http.post<UsuarioResponseDTO>(this.baseUrl + '/login', dto)),
      tap(user => this.currentUser.set(user)));
  }
  logout(): Observable<void> {
    return this.http.post<void>(this.baseUrl + '/logout', {}).pipe(
      tap(() => this.currentUser.set(null)),
      switchMap(() => this.http.get<void>(this.baseUrl + '/csrf')));
  }
  isAuthenticated(): boolean { return this.currentUser() !== null; }
  isTechOrAdmin(): boolean { return ['ADMINISTRADOR','TECNICO'].includes(this.currentUser()?.usuarioTipo ?? ''); }
  isAdmin(): boolean { return this.currentUser()?.usuarioTipo === 'ADMINISTRADOR'; }
  setUser(user: UsuarioResponseDTO | null): void { this.currentUser.set(user); }
}
