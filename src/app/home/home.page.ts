import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mascotas',
  templateUrl: './mascotas.page.html',
})
export class MascotasPage implements OnInit {
  mascotas: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadPets();
  }

  loadPets() {
    try {
      const raw = localStorage.getItem('pets');
      this.mascotas = raw ? JSON.parse(raw) : [];
    } catch {
      this.mascotas = [];
    }
  }

  addSample() {
    const id = Math.floor(Math.random() * 1000000).toString();
    const pet = { id, nombre: 'Firulais', tipo: 'Perro', edad: 3, proxVacuna: '2026-02-01' };
    this.mascotas.push(pet);
    localStorage.setItem('pets', JSON.stringify(this.mascotas));
  }

  openPerfil(id: string) {
    this.router.navigate(['/perfil-mascota', id]);
  }
}
