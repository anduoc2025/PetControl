import { Injectable } from '@angular/core';

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
  vaccines: Vaccine[];
}

@Injectable({ providedIn: 'root' })
export class PetService {
  private user = { email: 'demo@petcontrol.cl', password: '123456', name: 'Andres' };

  private pets: Pet[] = [
    {
      id: 1, name: 'Luna', species: 'Perro', breed: 'Quiltro', age: 0.2 ,
      sex: 'Hembra', color: 'Blanco con Cafe', diseases: 'Alergia a las pulgas', photo: 'Luna',
      vaccines: [
        { name: 'Antirrábica', date: '0000', applied: true },
        { name: 'Sextuple', date: '0000', applied: true },
        { name: 'Refuerzo anual', date: '0000', applied: false },
      ],
    },
    {
      id: 2, name: 'Touka', species: 'Gato', breed: 'Romano de Pelo corto', age: 4,
      sex: 'Hembra', color: 'Romano (Atigrado)', diseases: 'Ninguna', photo: 'Touka',
      vaccines: [
        { name: 'Triple felina', date: '0000', applied: true },
        { name: 'Antirrábica', date: '0000', applied: false },
      ],
    },
  ];

  private nextId = 3;

  login(email: string, password: string): boolean {
    return email === this.user.email && password === this.user.password;
  }

  getUser() { return this.user; }

  register(name: string, email: string, password: string): void {
    this.user = { name, email, password };
  }

  getPets(): Pet[] { return this.pets; }

  getPet(id: number): Pet | undefined {
    return this.pets.find((p) => p.id === id);
  }

  addPet(pet: Omit<Pet, 'id' | 'vaccines'>): void {
    this.pets.push({ ...pet, id: this.nextId++, vaccines: [] });
  }

  addVaccine(petId: number, vaccine: Vaccine): void {
    const pet = this.getPet(petId);
    if (pet) { pet.vaccines.push(vaccine); }
  }
}