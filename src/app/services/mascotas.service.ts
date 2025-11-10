import { Injectable } from '@angular/core';

export interface Mascota {
  id: number;
  nombre: string;
  tipo: string;
  edad: number;
  peso?: number | null;
  raza?: string;
  color?: string;
  motivo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MascotasService {
  private mascotas: Mascota[] = [];
  private idCounter = 1;

  constructor() {
    const raw = localStorage.getItem('pets');
    if (raw) {
      try {
        this.mascotas = JSON.parse(raw);
        const max = this.mascotas.reduce((a, b) => a > b.id ? a : b.id, 0);
        this.idCounter = max + 1;
      } catch {
        this.mascotas = [];
      }
    }
  }

  private persist() { localStorage.setItem('pets', JSON.stringify(this.mascotas)); }

  getMascotas(): Mascota[] { return this.mascotas; }

  getMascotaById(id: number): Mascota | undefined {
    return this.mascotas.find(m => m.id === id);
  }

  agregarMascota(m: Omit<Mascota, 'id'>) {
    const mascota: Mascota = { id: this.idCounter++, ...m };
    this.mascotas.push(mascota);
    this.persist();
    return mascota;
  }

  editarMascota(updated: Mascota) {
    const idx = this.mascotas.findIndex(m => m.id === updated.id);
    if (idx >= 0) { this.mascotas[idx] = updated; this.persist(); }
  }

  eliminarMascota(id: number) {
    this.mascotas = this.mascotas.filter(m => m.id !== id);
    this.persist();
  }
}
