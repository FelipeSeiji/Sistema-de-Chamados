import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TrocarSenhaDTO } from '../dto/trocarSenhaDTO';

@Injectable({
  providedIn: 'root'
})
export class UserSecurityService {
  private readonly baseUrl = '/api/usuarios';

  constructor(private http: HttpClient) {}

  trocarSenha(id: string, dto: TrocarSenhaDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/trocar-senha`, dto);
  }

  redefinirSenha(id: string, novaSenha: string): Observable<void> {
    const params = new HttpParams().set('novaSenha', novaSenha);
    return this.http.put<void>(`${this.baseUrl}/${id}/redefinir-senha`, null, { params });
  }
}