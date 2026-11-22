import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CriarUsuarioDTO } from '../dto/criarUsuarioDTO';
import { UsuarioResponseDTO } from '../dto/usuarioResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class UserImportService {
  private readonly baseUrl = '/api/v1/usuarios/importacao';

  constructor(private http: HttpClient) {}

  importarEmLote(usuarios: CriarUsuarioDTO[]): Observable<UsuarioResponseDTO[]> {
    return this.http.post<UsuarioResponseDTO[]>(this.baseUrl, usuarios);
  }
}
