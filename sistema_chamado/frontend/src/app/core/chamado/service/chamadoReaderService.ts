import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Chamado } from '../model/chamado';
import { StatusChamado } from '../enums/statusChamado';
import { CategoriaChamado } from '../enums/categoriaChamado';

@Injectable({ providedIn: 'root' })
export class ChamadoReaderService {
  private readonly baseUrl = '/api/chamados';

  constructor(private http: HttpClient) {}

  listar(status?: StatusChamado, categoria?: CategoriaChamado): Observable<Chamado[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (categoria) params = params.set('categoria', categoria);
    return this.http.get<Chamado[]>(this.baseUrl, { params });
  }

  buscarPorId(id: string): Observable<Chamado> {
    return this.http.get<Chamado>(`${this.baseUrl}/${id}`);
  }

  listarPorUsuario(usuarioId: string): Observable<Chamado[]> {
    return this.http.get<Chamado[]>(`${this.baseUrl}/usuario/${usuarioId}`);
  }

  obterEstatisticas(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.baseUrl}/dashboard/estatisticas`);
  }
}
