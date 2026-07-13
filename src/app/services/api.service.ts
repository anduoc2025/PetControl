import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StorageService } from './storage.service';

interface BreedsResponse {
  message: { [breed: string]: string[] };
  status: string;
}
interface ImageResponse {
  message: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'https://dog.ceo/api';
  // API de prueba para el POST (acepta envíos y responde con lo enviado)
  private postUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient, private storageService: StorageService) {}

  // ===== GET: lista de razas (con manejo de errores) =====
  getBreeds(): Observable<BreedsResponse> {
    return this.http.get<BreedsResponse>(`${this.baseUrl}/breeds/list/all`)
      .pipe(catchError((error) => this.manejarError(error)));
  }

  // ===== GET: imagen aleatoria de una raza =====
  getBreedImage(breed: string): Observable<ImageResponse> {
    return this.http.get<ImageResponse>(`${this.baseUrl}/breed/${breed}/images/random`)
      .pipe(catchError((error) => this.manejarError(error)));
  }

  // ===== POST: enviar un reporte de raza favorita (operación distinta a GET) =====
  enviarFavorito(breed: string): Observable<any> {
    const datos = { raza: breed, fecha: new Date().toISOString() };
    return this.http.post(this.postUrl, datos)
      .pipe(catchError((error) => this.manejarError(error)));
  }

  // ===== Manejo de errores centralizado =====
  private manejarError(error: HttpErrorResponse) {
    let mensaje = 'Ocurrió un error inesperado.';
    if (error.status === 0) {
      mensaje = 'Sin conexión a internet.';
    } else if (error.status === 404) {
      mensaje = 'Recurso no encontrado (404).';
    } else if (error.status >= 500) {
      mensaje = 'Error del servidor. Intenta más tarde.';
    } else {
      mensaje = `Error ${error.status}: ${error.message}`;
    }
    return throwError(() => new Error(mensaje));
  }

  // ===== Persistencia offline =====
  async cacheBreeds(breeds: string[]): Promise<void> {
    await this.storageService.set('breeds_cache', breeds);
  }

  async getCachedBreeds(): Promise<string[]> {
    return (await this.storageService.get('breeds_cache')) || [];
  }
}