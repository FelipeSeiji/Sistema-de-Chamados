import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Usuario, LoginDTO } from '../models/models';

const STORAGE_KEY = 'tvdiario_chamados_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<Usuario | null>(this.loadUserFromStorage());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  readonly isTechOrAdmin = computed(() => {
    const u = this.currentUserSignal();
    return u?.usuarioTipo === 'TECH' || u?.usuarioTipo === 'ADMIN';
  });

  constructor(private http: HttpClient, private router: Router) {}

  private loadUserFromStorage(): Usuario | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  login(credentials: LoginDTO): Observable<Usuario> {
    return this.http.post<Usuario>('/api/usuarios/login', credentials).pipe(
      tap((user) => {
        this.setUser(user);
      })
    );
  }

  setUser(user: Usuario): void {
    this.currentUserSignal.set(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem(STORAGE_KEY);
    this.router.navigate(['/login']);
  }
}
