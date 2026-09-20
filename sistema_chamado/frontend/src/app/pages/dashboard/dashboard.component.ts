import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Chamado } from '../../core/chamado/model/chamado';
import { ChamadoReaderService } from '../../core/chamado/service/chamadoReaderService';
import { AuthService } from '../../core/guards/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public authService = inject(AuthService);
  private chamadoReader = inject(ChamadoReaderService);

  chamados: Chamado[] = [];
  carregando = false;

  ngOnInit(): void {
    this.carregarChamados();
  }

  carregarChamados(): void {
    this.carregando = true;
    this.chamadoReader.listar().subscribe({
      next: (dados: Chamado[]) => {
        this.chamados = dados;
        this.carregando = false;
      },
      error: (err: unknown) => {
        console.error('Erro ao carregar chamados:', err);
        this.carregando = false;
      }
    });
  }
}