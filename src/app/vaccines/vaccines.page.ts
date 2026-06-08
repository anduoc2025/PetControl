
import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PetService, Pet } from '../services/pet.service';

@Component({
  selector: 'app-vaccines',
  templateUrl: './vaccines.page.html',
  styleUrls: ['./vaccines.page.scss'],
  standalone: false,
})
export class VaccinesPage {
  pet?: Pet;
  newName = '';
  newDate = new Date().toISOString();
  showForm = false;

  constructor(
    private route: ActivatedRoute,
    private petService: PetService,
    private toastCtrl: ToastController
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pet = this.petService.getPet(id);
  }

  async addVaccine() {
    if (!this.pet || this.newName.trim() === '') {
      const t = await this.toastCtrl.create({
        message: 'Escribe el nombre de la vacuna.',
        duration: 1800,
        color: 'warning',
        position: 'top',
      });
      t.present();
      return;
    }
    this.petService.addVaccine(this.pet.id, {
      name: this.newName.trim(),
      date: this.newDate,
      applied: new Date(this.newDate) <= new Date(),
    });
    this.newName = '';
    this.showForm = false;
    const t = await this.toastCtrl.create({
      message: 'Vacuna registrada 💉',
      duration: 1600,
      color: 'success',
      position: 'top',
    });
    t.present();
  }
}
