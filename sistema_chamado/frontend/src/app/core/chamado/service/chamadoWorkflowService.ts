import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Chamado } from '../model/chamado';
import { AtualizarChamadoDTO } from '../dto/atualizarChamadoDTO';
import { MotivoDTO } from '../dto/motivoDTO';

@Injectable({ providedIn: 'root' })
export class ChamadoWorkflowService {
  private readonly baseUrl = '/api/chamados';

  constructor(private http: HttpClient) {}

  assumir(id: string): Observable<Chamado> {
    return this.http.post<Chamado>(`${this.baseUrl}/${id}/assumir`, {});
  }

  atualizar(id: string, dto: AtualizarChamadoDTO): Observable<Chamado> {
    return this.http.put<Chamado>(`${this.baseUrl}/${id}/atualizar`, dto);
  }

  concluir(id: string, dto: MotivoDTO): Observable<Chamado> {
    return this.http.post<Chamado>(`${this.baseUrl}/${id}/concluir`, dto);
  }

  reabrir(id: string, dto?: MotivoDTO): Observable<Chamado> {
    return this.http.post<Chamado>(`${this.baseUrl}/${id}/reabrir`, dto || {});
  }
}