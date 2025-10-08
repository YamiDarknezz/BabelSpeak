import { Client, Account, Functions, Storage, Databases, ID } from 'appwrite';

// Configurar cliente con variables de entorno
export const client = new Client()
  .setEndpoint(_NGX_ENV_['NG_APP_APPWRITE_ENDPOINT'])
  .setProject(_NGX_ENV_['NG_APP_APPWRITE_PROJECT']);

// Instancias Appwrite
export const account = new Account(client);
export const functions = new Functions(client);
export const storage = new Storage(client);
export const databases = new Databases(client);

// Exportar ID (helper)
export { ID };
