import { Injectable } from '@angular/core';
import { databases, ID } from '../appwrite.config';
import { Query } from 'appwrite';

@Injectable({
  providedIn: 'root',
})
export class DatabasesService {
  private readonly DATABASE_ID = _NGX_ENV_['NG_APPWRITE_DATABASE_ID'];
  private readonly TRANSCRIPTIONS_COLLECTION_ID =
    _NGX_ENV_['NG_APPWRITE_TRANSCRIPTIONS_COLLECTION_ID'];

  constructor() {}

  // Obtener transcripciones de un usuario con paginación
  async getUserTranscriptions(
    userId: string,
    limit = 25,
    offset = 0,
    filtroTipo?: 'transcripcion' | 'traduccion',
    filtroIdioma?: 'es' | 'en',
    ordenarPor: 'fecha_hora' = 'fecha_hora',
    orden: 'asc' | 'desc' = 'desc'
  ) {
    try {
      const queries: any[] = [Query.equal('user_id', userId)];

      // Filtro opcional por tipo
      if (filtroTipo) {
        queries.push(Query.equal('tipo', filtroTipo));
      }

      // Filtro opcional por idioma
      if (filtroIdioma) {
        queries.push(Query.equal('idioma', filtroIdioma));
      }

      // Orden
      if (orden === 'asc') {
        queries.push(Query.orderAsc(ordenarPor));
      } else {
        queries.push(Query.orderDesc(ordenarPor));
      }

      // Paginación
      queries.push(Query.limit(limit));
      queries.push(Query.offset(offset));

      const response = await databases.listDocuments(
        this.DATABASE_ID,
        this.TRANSCRIPTIONS_COLLECTION_ID,
        queries
      );

      return response.documents;
    } catch (error: any) {
      console.error('Error obteniendo transcripciones:', error);
      return [];
    }
  }
}
