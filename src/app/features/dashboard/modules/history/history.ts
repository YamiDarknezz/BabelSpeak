import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatabasesService } from '../../../../core/services/databases/databases';
import { AuthService } from '../../../../core/services/auth/auth';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-history',
  imports: [FormsModule, DatePipe],
  templateUrl: './history.html',
  styleUrls: ['./history.scss'],
})
export class History implements OnInit {
  transcriptions: any[] = [];
  loading = false;

  // Filtros dinámicos
  filtroTipo: 'transcripcion' | 'traduccion' | '' = '';
  filtroIdioma: 'es' | 'en' | '' = '';
  ordenarPor: 'fecha_hora' = 'fecha_hora';
  orden: 'asc' | 'desc' = 'desc';

  // Paginación
  limit = 25;
  offset = 0;
  hasMore = true;

  constructor(
    private databasesService: DatabasesService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.loadTranscriptions();
  }

  async loadTranscriptions(reset = false) {
    if (!this.auth) return;
    this.loading = true;

    try {
      const user = await this.auth.getUser();
      if (!user) {
        alert('Debes iniciar sesión para ver tu historial.');
        this.loading = false;
        return;
      }

      // Si es reset, reiniciamos offset y lista
      if (reset) {
        this.offset = 0;
        this.transcriptions = [];
        this.hasMore = true;
      }

      const docs = await this.databasesService.getUserTranscriptions(
        user.$id,
        this.limit,
        this.offset,
        this.filtroTipo || undefined,
        this.filtroIdioma || undefined,
        this.ordenarPor,
        this.orden
      );

      // Concatenar resultados
      this.transcriptions = [...this.transcriptions, ...docs];

      if (docs.length < this.limit) {
        this.hasMore = false;
      } else {
        this.offset += this.limit;
      }
    } catch (error) {
      console.error('Error cargando historial:', error);
    } finally {
      this.loading = false;
    }
  }

  // Cargar siguiente página
  loadMore() {
    if (this.hasMore && !this.loading) {
      this.loadTranscriptions();
    }
  }

  // Aplicar filtros dinámicamente
  aplicarFiltros() {
    // Reiniciar lista y offset
    this.loadTranscriptions(true);
  }

  // Limpiar filtros
  limpiarFiltros() {
    this.filtroTipo = '';
    this.filtroIdioma = '';
    this.orden = 'desc';
    this.loadTranscriptions(true);
  }

  // Cambiar orden
  cambiarOrden(nuevoOrden: 'asc' | 'desc') {
    this.orden = nuevoOrden;
    this.loadTranscriptions(true);
  }
}
