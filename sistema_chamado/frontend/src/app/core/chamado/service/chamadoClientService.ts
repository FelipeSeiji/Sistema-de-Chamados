import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Chamado } from '../model/chamado';
import { CriarChamadoDTO } from '../dto/criarChamadoDTO';
import { EditarChamadoDTO } from '../dto/editarChamadoDTO';
import { MotivoDTO } from '../dto/motivoDTO';

@Injectable({ providedIn: 'root' })
export class ChamadoClientService {
  private readonly baseUrl = '/api/chamados';

  constructor(private http: HttpClient) {}

  abrirChamado(dto: CriarChamadoDTO, usuarioId: string): Observable<Chamado> {
    const params = new HttpParams().set('usuarioId', usuarioId);
    return this.http.post<Chamado>(this.baseUrl, dto, { params });
  }

  editar(id: string, dto: EditarChamadoDTO): Observable<Chamado> {
    return this.http.put<Chamado>(`${this.baseUrl}/${id}/editar`, dto);
  }

  cancelar(id: string, dto?: MotivoDTO): Observable<Chamado> {
    return this.http.post<Chamado>(`${this.baseUrl}/${id}/cancelar`, dto || {});
  }
}