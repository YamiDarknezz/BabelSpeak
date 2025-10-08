import { Injectable } from '@angular/core';
import { functions } from '../appwrite.config';

@Injectable({
  providedIn: 'root',
})
export class FunctionsService {
  constructor() {}

  private readonly BABEL_FUNCTION_ID =
    _NGX_ENV_['NG_APPWRITE_BABEL_FUNCTION_ID'];

  // Ejecutar cualquier función Appwrite con payload
  async executeBabelFunction(payload: any): Promise<any> {
    try {
      const execution = await functions.createExecution(
        this.BABEL_FUNCTION_ID,
        JSON.stringify(payload)
      );
      return execution;
    } catch (error: any) {
      console.error('Error ejecutando función Babel:', error);
      throw error;
    }
  }
}
