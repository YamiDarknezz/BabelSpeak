import { Injectable } from '@angular/core';
import { storage, functions, ID } from '../appwrite.config';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  private readonly BUCKET_ID = _NGX_ENV_['NG_APPWRITE_BUCKET_ID'];

  // Subir un archivo al bucket
  async uploadFile(file: File): Promise<string> {
    const result = await storage.createFile(this.BUCKET_ID, ID.unique(), file);
    return result.$id;
  }
}
