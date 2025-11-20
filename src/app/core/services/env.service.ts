import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EnvService {
  get apiUrl(): string {
    //console.log('apiurlin-Env-service' + process.env['NG_APP_API_URL']);
    console.log((window as any).__env?.NG_APP_API_URL);
    return (window as any).__env?.NG_APP_API_URL ?? 'https://localhost:4002';
  }
}
