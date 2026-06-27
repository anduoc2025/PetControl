import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { PetService } from '../services/pet.service';

@Component({
  selector: 'app-add-pet',
  templateUrl: './add-pet.page.html',
  styleUrls: ['./add-pet.page.scss'],
  standalone: false,
})
export class AddPetPage {
  petForm: FormGroup;
  emojis = ['🐶', '🐱', '🐰', '🐦', '🐹', '🐢'];
  lat?: number;
  lng?: number;
  gettingLocation = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private petService: PetService,
    private toastCtrl: ToastController
  ) {
    this.petForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      species: ['Perro', [Validators.required]],
      breed: ['', [Validators.required]],
      age: [null, [Validators.required, Validators.min(0), Validators.max(40)]],
      sex: ['Macho', [Validators.required]],
      color: [''],
      diseases: [''],
      photo: ['🐶', [Validators.required]],
    });
  }

  get name() { return this.petForm.get('name'); }
  get breed() { return this.petForm.get('breed'); }
  get age() { return this.petForm.get('age'); }

  selectEmoji(e: string) {
    this.petForm.patchValue({ photo: e });
  }

  // ===== PLUGIN DE GEOLOCALIZACIÓN =====
  async getLocation() {
    this.gettingLocation = true;
    try {
      const pos = await Geolocation.getCurrentPosition();
      this.lat = pos.coords.latitude;
      this.lng = pos.coords.longitude;
      const t = await this.toastCtrl.create({
        message: 'Ubicación obtenida correctamente 📍',
        duration: 1800, color: 'success', position: 'top',
      });
      t.present();
    } catch (e) {
      const t = await this.toastCtrl.create({
        message: 'No se pudo obtener la ubicación. Revisa los permisos.',
        duration: 2200, color: 'danger', position: 'top',
      });
      t.present();
    } finally {
      this.gettingLocation = false;
    }
  }

  async save() {
    if (this.petForm.invalid) {
      this.petForm.markAllAsTouched();
      return;
    }
    const v = this.petForm.value;
    await this.petService.addPet({
      name: v.name,
      species: v.species,
      breed: v.breed,
      age: Number(v.age),
      sex: v.sex,
      color: v.color || 'No especificado',
      diseases: v.diseases || 'Ninguna',
      photo: v.photo,
      lat: this.lat,
      lng: this.lng,
    });
    const toast = await this.toastCtrl.create({
      message: `${v.name} fue agregado correctamente 🐾`,
      duration: 2000, color: 'success', position: 'top',
    });
    toast.present();
    this.router.navigate(['/home']);
  }
}