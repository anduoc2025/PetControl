import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DbService } from '../../services/db.service';
import { ApiService } from '../../services/api.service';
import { IonicModule, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-agregar-mascota',
  templateUrl: './agregar-mascota.page.html',
  styleUrls: ['./agregar-mascota.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class AgregarMascotaPage implements OnInit {
  mascotaForm: FormGroup;
  razas!: Observable<string[]>;
  fotoSeleccionada!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dbService: DbService,
    private apiService: ApiService,
    private toastController: ToastController
  ) {
    this.mascotaForm = this.fb.group({
      nombre: ['', Validators.required],
      especie: ['Perro', Validators.required], // Valor por defecto
      raza: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.razas = this.apiService.getBreeds();
  }

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl, // Usar DataUrl para guardarlo directamente en la BD
        source: CameraSource.Camera
      });
      if (image.dataUrl) {
        this.fotoSeleccionada = image.dataUrl;
      }
    } catch (error) {
      console.error('Error al tomar la foto', error);
      this.presentToast('No se pudo tomar la foto.');
    }
  }

  async guardarMascota() {
    if (this.mascotaForm.invalid || !this.fotoSeleccionada) {
      this.presentToast('Por favor, complete todos los campos y tome una foto.');
      return;
    }

    const { nombre, especie, raza, edad } = this.mascotaForm.value;
    const userId = Number(localStorage.getItem('usuario_id'));

    if (!userId) {
      this.presentToast('Error de autenticación. Por favor, inicie sesión de nuevo.');
      this.router.navigate(['/login']);
      return;
    }

    this.dbService.almacenarPaciente(nombre, especie, raza, edad, this.fotoSeleccionada, userId)
      .then(() => {
        this.presentToast('Mascota guardada exitosamente.');
        this.router.navigate(['/home']);
      })
      .catch(e => {
        console.error('Error al guardar mascota', e);
        this.presentToast('Ocurrió un error al guardar la mascota.');
      });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: 'bottom'
    });
    toast.present();
  }
}
