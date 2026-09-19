import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, Departamento, StatusChamado, TrocarSenhaDTO } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = '/api/usuarios';

  constructor(private http: HttpClient) {}

  criar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, usuario);
  }

  listar(departamento?: Departamento): Observable<Usuario[]> {
    let params = new HttpParams();
    if (departamento) {
      params = params.set('departamento', departamento);
    }
    return this.http.get<Usuario[]>(this.baseUrl, { params });
  }

  listarTecnicos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/tecnicos`);
  }

  buscarPorId(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  atualizar(id: string, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/${id}`, usuario);
  }

  alterarStatus(id: string, status: StatusChamado): Observable<Usuario> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<Usuario>(`${this.baseUrl}/${id}/status`, null, { params });
  }

  trocarSenha(id: string, dto: TrocarSenhaDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/trocar-senha`, dto);
  }

  redefinirSenha(id: string, novaSenha: string): Observable<void> {
    const params = new HttpParams().set('novaSenha', novaSenha);
    return this.http.put<void>(`${this.baseUrl}/${id}/redefinir-senha`, null, { params });
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  importar(usuarios: Usuario[]): Observable<Usuario[]> {
    return this.http.post<Usuario[]>(`${this.baseUrl}/importar`, usuarios);
  }
}
