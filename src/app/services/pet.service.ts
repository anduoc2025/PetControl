import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

export interface Vaccine {
  name: string;
  date: string;
  applied: boolean;
}

export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  sex: string;
  color: string;
  diseases: string;
  photo: string;
  lat?: number;
  lng?: number;
  vaccines: Vaccine[];
}

@Injectable({ providedIn: 'root' })
export class PetService {
  private user = { email: 'demo@petcontrol.cl', password: '123456', name: ' Andres Barra' };

  private defaultPets: Pet[] = [
    {
      id: 1, name: 'Luna', species: 'Perro', breed: 'Quiltro', age: 0.4,
      sex: 'Macho', color: 'Blanco con cafr', diseases: 'Alergia a las pulgas', photo: '🐶',
      vaccines: [
        { name: 'Antirrábica', date: '2025-03-10', applied: true },
        { name: 'Sextuple', date: '2025-04-15', applied: true },
        { name: 'Refuerzo anual', date: '2026-03-10', applied: false },
      ],
    },
    {
      id: 2, name: 'Touka', species: 'Gato', breed: 'Romano', age: 4 ,
      sex: 'Hembra', color: 'Crema', diseases: 'Ninguna', photo: '🐱',
      vaccines: [
        { name: 'Triple felina', date: '2025-05-20', applied: true },
        { name: 'Antirrábica', date: '2026-05-20', applied: true },
      ],
    },
  ];

  private pets: Pet[] = [];
  private nextId = 3;

  constructor(private storageService: StorageService) {}

  async loadPets(): Promise<void> {
    const saved = await this.storageService.get('pets');
    if (saved && saved.length) {
      this.pets = saved;
      this.nextId = Math.max(...this.pets.map((p) => p.id)) + 1;
    } else {
      this.pets = this.defaultPets;
      await this.persist();
    }
  }

  private async persist(): Promise<void> {
    await this.storageService.set('pets', this.pets);
  }

  // ===== Autenticación con sesión persistida (para el Route Guard) =====
  async login(email: string, password: string): Promise<boolean> {
    const ok = email === this.user.email && password === this.user.password;
    if (ok) {
      await this.storageService.set('session', { email, name: this.user.name });
    }
    return ok;
  }

  async isAuthenticated(): Promise<boolean> {
    const session = await this.storageService.get('session');
    return !!session;
  }

  async logout(): Promise<void> {
    await this.storageService.remove('session');
  }

  getUser() {
    return this.user;
  }

  register(name: string, email: string, password: string): void {
    this.user = { name, email, password };
  }

  // ===== CRUD de mascotas (ahora persistido) =====
  getPets(): Pet[] {
    return this.pets;
  }

  getPet(id: number): Pet | undefined {
    return this.pets.find((p) => p.id === id);
  }

  async addPet(pet: Omit<Pet, 'id' | 'vaccines'>): Promise<void> {
    this.pets.push({ ...pet, id: this.nextId++, vaccines: [] });
    await this.persist();
  }

  async addVaccine(petId: number, vaccine: Vaccine): Promise<void> {
    const pet = this.getPet(petId);
    if (pet) {
      pet.vaccines.push(vaccine);
      await this.persist();
    }
  }
}