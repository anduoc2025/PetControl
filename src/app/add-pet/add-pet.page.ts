
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private petService: PetService,
    private toastCtrl: ToastController
  ) {
    // ===== Formulario reactivo con validaciones =====
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

  async save() {
    if (this.petForm.invalid) {
      this.petForm.markAllAsTouched();
      return;
    }
    const v = this.petForm.value;
    this.petService.addPet({
      name: v.name,
      species: v.species,
      breed: v.breed,
      age: Number(v.age),
      sex: v.sex,
      color: v.color || 'No especificado',
      diseases: v.diseases || 'Ninguna',
      photo: v.photo,
    });
    const toast = await this.toastCtrl.create({
      message: `${v.name} fue agregado correctamente 🐾`,
      duration: 2000,
      color: 'success',
      position: 'top',
    });
    toast.present();
    this.router.navigate(['/home']);
  }
}