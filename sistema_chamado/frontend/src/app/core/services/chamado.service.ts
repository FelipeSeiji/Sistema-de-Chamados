import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Chamado,
  StatusChamado,
  CategoriaChamado,
  AtualizarChamadoDTO,
  MotivoDTO,
  EditarChamadoDTO
} from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ChamadoService {
  private readonly baseUrl = '/api/chamados';

  constructor(private http: HttpClient) {}

  abrirChamado(chamado: Partial<Chamado>, usuarioId: string): Observable<Chamado> {
    const params = new HttpParams().set('usuarioId', usuarioId);
    return this.http.post<Chamado>(this.baseUrl, chamado, { params });
  }

  listar(status?: StatusChamado, categoria?: CategoriaChamado): Observable<Chamado[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    if (categoria) {
      params = params.set('categoria', categoria);
    }
    return this.http.get<Chamado[]>(this.baseUrl, { params });
  }

  buscarPorId(id: string): Observable<Chamado> {
    return this.http.get<Chamado>(`${this.baseUrl}/${id}`);
  }

  listarPorUsuario(usuarioId: string): Observable<Chamado[]> {
    return this.http.get<Chamado[]>(`${this.baseUrl}/usuario/${usuarioId}`);
  }

  assumir(id: string): Observable<Chamado> {
    return this.http.post<Chamado>(`${this.baseUrl}/${id}/assumir`, {});
  }

  atualizar(id: string, dto: AtualizarChamadoDTO): Observable<Chamado> {
    return this.http.put<Chamado>(`${this.baseUrl}/${id}/atualizar`, dto);
  }

  concluir(id: string, dto: MotivoDTO): Observable<Chamado> {
    return this.http.post<Chamado>(`${this.baseUrl}/${id}/concluir`, dto);
  }

  editar(id: string, dto: EditarChamadoDTO): Observable<Chamado> {
    return this.http.put<Chamado>(`${this.baseUrl}/${id}/editar`, dto);
  }

  reabrir(id: string, dto?: MotivoDTO): Observable<Chamado> {
    return this.http.post<Chamado>(`${this.baseUrl}/${id}/reabrir`, dto || {});
  }

  cancelar(id: string, dto?: MotivoDTO): Observable<Chamado> {
    return this.http.post<Chamado>(`${this.baseUrl}/${id}/cancelar`, dto || {});
  }

  obterEstatisticas(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.baseUrl}/estatisticas`);
  }
}
