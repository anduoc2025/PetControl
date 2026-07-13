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

  // ===== PLUGIN DE GEOLOCALIZACIÓN (con manejo de escenarios) =====
  async getLocation() {
    this.gettingLocation = true;
    try {
      // 1) Verificar y pedir permisos primero
      const permiso = await Geolocation.checkPermissions();
      if (permiso.location === 'denied') {
        const nuevoPermiso = await Geolocation.requestPermissions();
        if (nuevoPermiso.location === 'denied') {
          await this.mostrarMensaje('Permiso de ubicación denegado. Actívalo para usar el GPS.', 'warning');
          this.gettingLocation = false;
          return;
        }
      }

      // 2) Obtener la ubicación con un tiempo límite (por si el GPS se demora)
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000, // 10 segundos máximo
      });

      // 3) Validar que las coordenadas sean correctas
      if (pos && pos.coords && pos.coords.latitude) {
        this.lat = pos.coords.latitude;
        this.lng = pos.coords.longitude;
        await this.mostrarMensaje('Ubicación obtenida correctamente 📍', 'success');
      } else {
        await this.mostrarMensaje('No se pudieron obtener coordenadas válidas.', 'danger');
      }
    } catch (error: any) {
      // 4) Manejo específico según el tipo de error
      if (error?.message?.includes('timeout')) {
        await this.mostrarMensaje('El GPS tardó demasiado. Intenta de nuevo en un lugar con mejor señal.', 'warning');
      } else if (error?.message?.includes('denied') || error?.code === 1) {
        await this.mostrarMensaje('Permiso de ubicación denegado.', 'warning');
      } else if (error?.code === 2) {
        await this.mostrarMensaje('GPS no disponible en este dispositivo.', 'danger');
      } else {
        await this.mostrarMensaje('No se pudo obtener la ubicación. Revisa el GPS y los permisos.', 'danger');
      }
    } finally {
      this.gettingLocation = false;
    }
  }

  // Función auxiliar para mostrar mensajes (evita repetir código)
  private async mostrarMensaje(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      color: color,
      position: 'top',
    });
    toast.present();
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