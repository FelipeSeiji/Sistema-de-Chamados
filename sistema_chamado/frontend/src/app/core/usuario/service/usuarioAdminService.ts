import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Departamento } from '../model/enums/usuarioDepartamento';
import { CriarUsuarioDTO } from '../dto/criarUsuarioDTO';
import { AtualizarUsuarioDTO } from '../dto/atualizarUsuarioDTO';
import { UsuarioResponseDTO } from '../dto/usuarioResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {
  private readonly baseUrl = '/api/v1/usuarios';

  constructor(private http: HttpClient) {}

  criar(dto: CriarUsuarioDTO): Observable<UsuarioResponseDTO> {
    return this.http.post<UsuarioResponseDTO>(this.baseUrl, dto);
  }

  listar(departamento?: Departamento): Observable<UsuarioResponseDTO[]> {
    let params = new HttpParams();
    if (departamento) {
      params = params.set('departamento', departamento);
    }
    return this.http.get<UsuarioResponseDTO[]>(this.baseUrl, { params });
  }

  listarTecnicos(): Observable<UsuarioResponseDTO[]> {
    return this.http.get<UsuarioResponseDTO[]>(`${this.baseUrl}/tecnicos`);
  }

  buscarPorId(id: string): Observable<UsuarioResponseDTO> {
    return this.http.get<UsuarioResponseDTO>(`${this.baseUrl}/${id}`);
  }

  atualizar(id: string, dto: AtualizarUsuarioDTO): Observable<UsuarioResponseDTO> {
    return this.http.put<UsuarioResponseDTO>(`${this.baseUrl}/${id}`, dto);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
