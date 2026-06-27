import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  constructor(private http: HttpClient, private storageService: StorageService) {}

  getBreeds(): Observable<BreedsResponse> {
    return this.http.get<BreedsResponse>(`${this.baseUrl}/breeds/list/all`);
  }

  getBreedImage(breed: string): Observable<ImageResponse> {
    return this.http.get<ImageResponse>(`${this.baseUrl}/breed/${breed}/images/random`);
  }

  async cacheBreeds(breeds: string[]): Promise<void> {
    await this.storageService.set('breeds_cache', breeds);
  }

  async getCachedBreeds(): Promise<string[]> {
    return (await this.storageService.get('breeds_cache')) || [];
  }
}