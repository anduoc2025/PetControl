import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PetService, Pet } from '../services/pet.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage {
  filter = 'Todos';

  constructor(private petService: PetService, private router: Router) {}

  get pets(): Pet[] {
    const all = this.petService.getPets();
    if (this.filter === 'Todos') return all;
    return all.filter((p) => p.species === this.filter);
  }

  get userName(): string {
    return this.petService.getUser().name;
  }

  openDetail(pet: Pet) {
    this.router.navigate(['/pet-detail', pet.id]);
  }

  addPet() {
    this.router.navigate(['/add-pet']);
  }

  goProfile() {
    this.router.navigate(['/profile']);
  }

  goBreeds() {
    this.router.navigate(['/breeds']);
  }
}
