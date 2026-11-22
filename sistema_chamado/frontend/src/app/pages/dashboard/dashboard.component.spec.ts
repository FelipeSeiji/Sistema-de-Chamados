import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

describe('Dashboard HTTP rendering', () => {
  it('renders an asynchronous response and leaves the loading state', async () => {
    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    });
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.autoDetectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('/api/chamados').flush([{
      id: 42, titulo: 'Rede do estúdio', descricao: 'Validar conectividade',
      usuarioNome: 'Demonstração', usuarioId: 'demo', categoria: 'TI_REDE',
      status: 'ABERTO', prioridade: 'ALTA', criadoEm: '2026-11-21T10:00:00'
    }]);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Rede do estúdio');
    expect(fixture.nativeElement.textContent).not.toContain('Carregando chamados');
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(1);
    http.verify();
  });
});
